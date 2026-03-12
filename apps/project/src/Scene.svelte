<script lang="ts">
  const TIMEOUT = 2000;
  const TIMEOUT_STEP = 100;
  const waitFor = (condition, callback, timeout) => {
    if (!condition()) {
      const timeoutNew = typeof timeout !== "undefined" ? timeout - TIMEOUT_STEP : TIMEOUT;

      if (timeoutNew > 0) {
        setTimeout(waitFor.bind(null, condition, callback, timeoutNew), TIMEOUT_STEP);
      }
    } else {
      callback();
    }
  };

  const colors = {
    green: "#ffed00",
    blue: "#009fe3",
  };
  import { T, useTask, useThrelte } from "@threlte/core";
  import {
    CatmullRomCurve3,
    DoubleSide,
    MeshBasicMaterial,
    NoToneMapping,
    Shape,
    SRGBColorSpace,
    TubeGeometry,
    Vector2,
    Vector3,
  } from "three";
  import { onMount } from "svelte";
  import {
    LOGO_LETTER_RELATIVE_POINTS,
    LOGO_LETTERS_NOISE_TIMESTAMP_OFFSET,
    LOGO_LETTERS_SCALE,
    PARTICLE_GEOMETRY_NAMES,
    SHAPES_ROTATE_DURATION_MAX,
    SHAPES_ROTATE_DURATION_MIN,
  } from "./constants";
  import {
    calculateOppositeVectorToPointWithBounds,
    createExtrudedLetterGeometryAlongCurveFacingCamera,
    bendCurve,
    addNoiseToCurve,
    getLetterScaleOriginPoint,
    getLogoLetterPositionVector3,
    getDirectionRatios,
    getRandomParticleGeometryName,
    getGeometryByName,
    updateExtrudedLetterGeometryAlongCurveFacingCamera,
    updateLineGeometry,
    updateSpiralGeometry,
  } from "./utils";
  import { Spring } from "svelte/motion";

  let { pointerPosition } = $props();

  let camera = $state(null);
  let scale = $state(1);
  let viewportDimensions = $state({ width: { full: 0, half: 0 }, height: { full: 0, half: 0 } });
  let side = $derived(
    Math.min(viewportDimensions.width.full, viewportDimensions.height.full) * 0.25,
  );
  let active = $state(false);
  let timestamp = $state(0);
  let particleSize = $derived(side * 0.4);
  const letterShapeGeometries = $state({});
  const particles = $state({
    positions: [],
    rotations: [],
    materials: [],
    geometries: [],
  });

  const materials = {
    front: {
      green: new MeshBasicMaterial({ color: colors.green }),
      blue: new MeshBasicMaterial({ color: colors.blue }),
    },
    double: {
      green: new MeshBasicMaterial({ color: colors.green, side: DoubleSide }),
      blue: new MeshBasicMaterial({ color: colors.blue, side: DoubleSide }),
    },
  };

  const pointerPositionSpringed = new Spring([0, 0]);
  const letterDirectionVectorsSpringed = {
    r: new Spring([0, 0]),
    c: new Spring([0, 0]),
    k: new Spring([0, 0]),
    t: new Spring([0, 0]),
  };

  $effect(() => {
    active =
      Math.abs(pointerPositionSpringed.current[0]) <= side &&
      Math.abs(pointerPositionSpringed.current[1]) <= side;
  });

  $effect(() => {
    pointerPositionSpringed.set([
      pointerPosition.x - viewportDimensions.width.half,
      viewportDimensions.height.half - pointerPosition.y,
    ]);
  });

  $effect(() => {
    if (!pointerPositionSpringed.current[0] && !pointerPositionSpringed.current[1]) {
      return;
    }

    // Hotspot for activating the leaning
    if (active) {
      mainTask.start();

      const sideQuarter = side / 4;

      Object.entries(letterDirectionVectorsSpringed).forEach(([key, value]) => {
        const letterPositionVector3 = getLogoLetterPositionVector3(key, side);

        value.set(
          calculateOppositeVectorToPointWithBounds({
            pointSource: pointerPositionSpringed.current,
            pointCenter: [
              letterPositionVector3[0] + sideQuarter,
              letterPositionVector3[1] + sideQuarter,
            ],
            bounds: {
              x: {
                min: -viewportDimensions.width.half,
                max: viewportDimensions.width.half,
              },
              y: {
                min: -viewportDimensions.height.half,
                max: viewportDimensions.height.half,
              },
            },
            ratio: 0.6,
          }),
        );
      });
    } else {
      Object.entries(letterDirectionVectorsSpringed).forEach(([key, value]) => {
        if (value.current[0] || value.current[1]) {
          value.set([0, 0]);
        }
      });
    }
  });

  onMount(() => {
    const scene = useThrelte();
    const handleResize = () => {
      viewportDimensions = {
        width: {
          full: window.innerWidth,
          half: window.innerWidth / 2,
        },
        height: {
          full: window.innerHeight,
          half: window.innerHeight / 2,
        },
      };

      updateLetters();
      generateParticles();
    };

    camera = scene.camera.current;

    scene.renderer.toneMapping = NoToneMapping;
    scene.renderer.outputColorSpace = SRGBColorSpace;

    window.addEventListener("resize", handleResize, { passive: true });

    setTimeout(handleResize, 0);
    waitFor(
      () => !!(viewportDimensions.height.full && viewportDimensions.width.full && side),
      () => {
        generateParticles();
      },
    );

    return () => window.removeEventListener("resize", handleResize);
  });

  const updateLetters = (reset) => {
    Object.entries(LOGO_LETTER_RELATIVE_POINTS).forEach(([letter, points], index) => {
      const sideQuarter = side / 4;
      const letterPositionVector3 = getLogoLetterPositionVector3(letter, side);
      const directionRatios = getDirectionRatios(
        [letterPositionVector3[0] + sideQuarter, letterPositionVector3[1] + sideQuarter],
        pointerPositionSpringed.current,
      );
      const letterDirectionVector = letterDirectionVectorsSpringed[letter].current;
      const bendStrength = letterDirectionVector.every((value) => !value)
        ? 0
        : side -
          new Vector2(letterPositionVector3[0], letterPositionVector3[1]).distanceTo(
            new Vector2(pointerPositionSpringed.current[0], pointerPositionSpringed.current[1]),
          );
      const curve = new CatmullRomCurve3([], false, "centripetal", 0.5);
      const scaleFactor =
        (scale - LOGO_LETTERS_SCALE.min) / (LOGO_LETTERS_SCALE.max - LOGO_LETTERS_SCALE.min);

      if (!reset) {
        bendCurve(
          curve,
          new Vector3(0, 0, 0),
          new Vector3(...letterDirectionVector, 1000),
          directionRatios,
          bendStrength < 0 ? 0 : bendStrength * scaleFactor,
        );

        addNoiseToCurve(
          curve,
          side * 0.05 * scaleFactor,
          timestamp + index * LOGO_LETTERS_NOISE_TIMESTAMP_OFFSET,
        );
      } else {
        bendCurve(curve, new Vector3(0, 0, 0), new Vector3(0, 0, 1000), [0, 0], 0);
      }

      const shape = new Shape();

      shape.moveTo(points[0][0] * side, points[0][1] * side);

      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i][0] * side, points[i][1] * side);
      }

      shape.closePath();

      const geometry = letterShapeGeometries[letter];

      if (geometry) {
        updateExtrudedLetterGeometryAlongCurveFacingCamera({
          shape,
          curve,
          endScale: scale,
          camera,
          origin: getLetterScaleOriginPoint(letter),
          letter: letter,
          geometry,
        });
      } else {
        letterShapeGeometries[letter] =
          createExtrudedLetterGeometryAlongCurveFacingCamera({
            shape,
            curve,
            endScale: scale,
            camera,
            origin: getLetterScaleOriginPoint(letter),
            letter: letter,
          });
      }
    });
  };

  const updateParticles = () => {
    particles.geometries.forEach((item, index) => {
      switch (item.type) {
        case "line": {
          updateLineGeometry(item.geometry, particleSize, timestamp + (item.meta.offset || 0));

          break;
        }

        case "spiral": {
          if (
            typeof item.meta.factor !== "undefined" &&
            typeof item.meta.offset !== "undefined" &&
            item.geometry instanceof TubeGeometry
          ) {
            item.meta.factor += item.meta.offset;

            if (Math.abs(item.meta.factor) >= 1) {
              item.meta.offset = -item.meta.offset;
            }

            updateSpiralGeometry(item.geometry, particleSize, item.meta.factor);
          }

          break;
        }
      }
    });
  };

  const generateParticles = () => {
    particles.geometries.forEach((item) => {
      item.geometry.dispose();
    });

    const particlePositions = [];
    const particleRotations = [];
    const particleMaterials = [];
    const particleGeometries = [];
    let rows = Math.floor(viewportDimensions.height.full / side);
    let cols = Math.floor(viewportDimensions.width.full / side);

    rows = rows % 2 === 0 ? rows - 1 : rows;
    cols = cols % 2 === 0 ? cols - 1 : cols;

    // Shift to position the grind inside the existing 2D one
    const x =
      (viewportDimensions.width.full - cols * side) / 2 + side - viewportDimensions.width.half;
    const y =
      (viewportDimensions.height.full - rows * side) / 2 + side - viewportDimensions.height.half;
    const xMiddle = Math.floor(cols / 2);
    const yMiddle = Math.floor(rows / 2);
    const xMiddles = [xMiddle - 1, xMiddle];
    const yMiddles = [yMiddle - 1, yMiddle];

    // Minus one for the rows and cols to have 1 less to be inside the 2D grid
    rows = rows - 1;
    cols = cols - 1;

    for (let i = 0; i < rows; i++) {
      for (let k = 0; k < cols; k++) {
        if (xMiddles.includes(k) && yMiddles.includes(i)) {
          continue;
        } else {
          const geometryName = getRandomParticleGeometryName();
          const material = ["spiral", "line"].includes(geometryName)
            ? materials.double
            : materials.front;
          let offset = Math.random() * 0.1;
          let factor = Math.random();

          if (geometryName === "line") {
            offset = side * 0.2 + Math.random() * (side * 0.2);
          }

          particlePositions.push([x + k * side, y + i * side]);
          particleRotations.push(
            new Vector3()
              .random()
              .multiplyScalar(
                (SHAPES_ROTATE_DURATION_MIN +
                  Math.floor(
                    Math.random() * (SHAPES_ROTATE_DURATION_MAX - SHAPES_ROTATE_DURATION_MIN),
                  )) /
                  1000,
              )
              .toArray(),
          );
          particleMaterials.push(Math.random() > 0.5 ? material.green : material.blue);
          particleGeometries.push({
            type: geometryName,
            meta: { offset, factor },
            geometry: getGeometryByName(geometryName, particleSize, timestamp + offset, factor),
          });
        }
      }
    }

    particles.positions = particlePositions;
    particles.rotations = particleRotations;
    particles.materials = particleMaterials;
    particles.geometries = particleGeometries;
  };

  const mainTask = useTask(
    (delta) => {
      // Scale the letters curve ends based on the "hover" state
      scale = active
        ? Math.min(LOGO_LETTERS_SCALE.max, scale + delta * 4)
        : Math.max(LOGO_LETTERS_SCALE.min, scale - delta * 6);

      if (scale <= LOGO_LETTERS_SCALE.min) {
        mainTask.stop();
        updateLetters(true);
      } else {
        timestamp += delta;

        updateLetters();
        updateParticles();
      }
    },
    {
      autoStart: false,
    },
  );

  const calculateParticleScale = (
    targetPos,
    pointerPos,
    scaleGlobal,
  ) => {
    const targetVector = new Vector2(targetPos[0], targetPos[1]);
    const pointerRay = new Vector2(pointerPos[0], pointerPos[1]).normalize();

    if (targetVector.dot(pointerRay) < 0) {
      return 0;
    }

    const projection = pointerRay.clone().multiplyScalar(targetVector.dot(pointerRay));
    const distanceToRay = targetVector.distanceTo(projection);
    const globalScaleRatio =
      (scaleGlobal - LOGO_LETTERS_SCALE.min) / (LOGO_LETTERS_SCALE.max - LOGO_LETTERS_SCALE.min);
    const scale = distanceToRay / (side * 2);

    return scale > 1 ? 0 : (1 - scale) * globalScaleRatio;
  };
</script>

<T.OrthographicCamera
  left={-viewportDimensions.width.half}
  right={viewportDimensions.width.half}
  top={viewportDimensions.height.half}
  bottom={-viewportDimensions.height.half}
  position={[0, 0, 1]}
  near={-1600}
  far={1600}
  makeDefault
/>
{#each Object.entries(letterShapeGeometries) as [letter, geometry]}
  <T.Mesh
    position={getLogoLetterPositionVector3(letter, side)}
    material={[materials.front.green, materials.front.blue]}
    {geometry}
  />
{/each}
{#each particles.positions as coordinates, index}
  <T.Mesh
    position={[coordinates[0], coordinates[1], 0]}
    rotation={[
      particles.rotations[index][0] * timestamp,
      particles.rotations[index][1] * timestamp,
      particles.rotations[index][2] * timestamp,
    ]}
    scale={calculateParticleScale(coordinates, pointerPositionSpringed.current, scale)}
    material={particles.materials[index]}
    geometry={particles.geometries[index].geometry}
  />
{/each}
