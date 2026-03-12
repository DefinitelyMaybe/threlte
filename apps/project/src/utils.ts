import {
  BufferGeometry,
  CatmullRomCurve3,
  Float32BufferAttribute,
  MathUtils,
  Shape,
  Vector2,
  Vector3,
  BoxGeometry,
  TubeGeometry,
  //DynamicDrawUsage,
  TetrahedronGeometry,
  BufferAttribute,
} from "three";
import {
  LOGO_LETTER_RELATIVE_POINTS,
  LOGO_LETTERS_RELATIVE_GAP,
  PARTICLE_GEOMETRY_NAMES,
  SHAPES_LINE_WIDTH,
} from "./constants";
import type {
  ComputeExtrudedLetterGeometryAlongCurveFacingCameraAttributesProps,
  TLetter,
  TOrigin,
} from "./types";

const dummyBufferGeometry = new BufferGeometry();

export const getLogoLetterPositionVector3 = (
  letter: TLetter,
  side: number,
): [x: number, y: number, z: number] => {
  const sideHalf = side / 2;

  switch (letter) {
    case "r":
      return [
        -sideHalf + side * LOGO_LETTERS_RELATIVE_GAP,
        sideHalf * LOGO_LETTERS_RELATIVE_GAP,
        0,
      ];
    case "c":
      return [sideHalf * LOGO_LETTERS_RELATIVE_GAP, sideHalf * LOGO_LETTERS_RELATIVE_GAP, 0];
    case "k":
      return [
        -sideHalf + side * LOGO_LETTERS_RELATIVE_GAP,
        -sideHalf + side * LOGO_LETTERS_RELATIVE_GAP,
        0,
      ];
    case "t":
      return [
        sideHalf * LOGO_LETTERS_RELATIVE_GAP,
        -sideHalf + side * LOGO_LETTERS_RELATIVE_GAP,
        0,
      ];
    default:
      return [0, 0, 0];
  }
};

const computeOriginPoint = (points: Vector2[], origin?: TOrigin) => {
  let width = 0;
  let height = 0;
  let values = [0, 0];

  for (const point of points) {
    width = Math.max(width, point.x);
    height = Math.max(height, point.y);
  }

  switch (origin) {
    case "top-left": {
      values = [0, height];

      break;
    }

    case "top-center": {
      values = [width / 2, height];

      break;
    }

    case "top-right": {
      values = [width, height];

      break;
    }

    case "center-left": {
      values = [0, height / 2];

      break;
    }

    default:
    case "center": {
      values = [width / 2, height / 2];

      break;
    }

    case "center-right": {
      values = [width, height / 2];

      break;
    }

    case "bottom-left": {
      values = [0, 0];

      break;
    }

    case "bottom-center": {
      values = [width / 2, 0];

      break;
    }

    case "bottom-right": {
      values = [width, 0];

      break;
    }
  }

  return new Vector2(values[0], values[1]);
};

export const computeExtrudedLetterGeometryAlongCurveFacingCameraAttributes = ({
  shape,
  curve,
  endScale = 1,
  camera,
  origin,
  segments = 16,
}: ComputeExtrudedLetterGeometryAlongCurveFacingCameraAttributesProps) => {
  if (!camera) {
    return {
      positions: [],
      //uvs: [],
      indices: [],
    };
  }

  const shapePoints = shape.getPoints();
  const shapeVertexCount = shapePoints.length;
  const originPoint = computeOriginPoint(shapePoints, origin);
  const cameraQuaternion = camera.quaternion.clone();
  const positions = [];
  const indices = [];
  //const uvs = [];

  // Build vertices
  for (let i = 0; i <= segments; i++) {
    const segmentIndex = i / segments;
    const positionOnCurve = curve.getPointAt(segmentIndex);

    // Scale from center: 1 → endScale
    const scale = MathUtils.lerp(1, endScale, segmentIndex);

    for (let j = 0; j < shapeVertexCount; j++) {
      const point = shapePoints[j];

      // Move to center
      const localX = point.x - originPoint.x;
      const localY = point.y - originPoint.y;

      // Scale
      const v = new Vector3(localX * scale, localY * scale, 0);

      // Move back from center
      v.x += originPoint.x;
      v.y += originPoint.y;

      // Billboard rotation
      v.applyQuaternion(cameraQuaternion);

      // Curve placement
      v.add(positionOnCurve);

      positions.push(v.x, v.y, v.z);
      //uvs.push(j / shapeVertexCount, segmentIndex);
    }
  }

  // Side faces
  for (let i = 0; i < segments; i++) {
    const rowA = i * shapeVertexCount;
    const rowB = (i + 1) * shapeVertexCount;

    for (let j = 0; j < shapeVertexCount; j++) {
      const a = rowA + j;
      const b = rowA + ((j + 1) % shapeVertexCount);
      const c = rowB + ((j + 1) % shapeVertexCount);
      const d = rowB + j;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Start cap
  for (let i = 1; i < shapeVertexCount - 1; i++) {
    indices.push(0, i + 1, i);
  }

  // End cap
  const endOffset = segments * shapeVertexCount;

  for (let i = 1; i < shapeVertexCount - 1; i++) {
    indices.push(endOffset, endOffset + i, endOffset + i + 1);
  }

  return {
    positions,
    //uvs,
    indices,
  };
};

export const createExtrudedLetterGeometryAlongCurveFacingCamera = (
  props: ComputeExtrudedLetterGeometryAlongCurveFacingCameraAttributesProps,
) => {
  if (!props.camera) {
    return dummyBufferGeometry;
  }

  const attributes = computeExtrudedLetterGeometryAlongCurveFacingCameraAttributes(props);
  const geometry = new BufferGeometry();

  geometry.setAttribute("position", new Float32BufferAttribute(attributes.positions, 3));
  geometry.setIndex(attributes.indices);
  //geometry.computeVertexNormals();
  //geometry.index?.setUsage(DynamicDrawUsage);

  // Add groups to be able to assign different materials for camera facing faces
  if (geometry.index) {
    const faceIndicesCount = LOGO_LETTER_RELATIVE_POINTS[props.letter].length * 2 + 2;

    geometry.addGroup(0, geometry.index.count - faceIndicesCount, 0);
    geometry.addGroup(geometry.index.count - faceIndicesCount, faceIndicesCount, 1);
  }

  return geometry;
};

export const updateExtrudedLetterGeometryAlongCurveFacingCamera = (
  props: ComputeExtrudedLetterGeometryAlongCurveFacingCameraAttributesProps & {
    geometry: BufferGeometry;
  },
) => {
  const { geometry, ...rest } = props;
  const attributes = computeExtrudedLetterGeometryAlongCurveFacingCameraAttributes(rest);

  for (let i = 0; i < attributes.positions.length; i++) {
    geometry.attributes.position.array[i] = attributes.positions[i];
  }

  geometry.attributes.position.needsUpdate = true;

  // for (let i = 0; i < attributes.uvs.length; i++) {
  //   geometry.attributes.uv.array[i] = attributes.uvs[i];
  // }

  // geometry.attributes.uv.needsUpdate = true;

  // if (geometry.attributes.index) {
  //   for (let i = 0; i < attributes.indices.length; i++) {
  //     geometry.attributes.index.array[i] = attributes.indices[i];
  //   }

  //   geometry.attributes.index.needsUpdate = true;
  // }
};

export const getLetterScaleOriginPoint = (letter: TLetter): TOrigin => {
  switch (letter) {
    case "r":
      return "bottom-right";
    case "c":
      return "bottom-left";
    case "k":
      return "top-right";
    case "t":
      return "top-left";
  }
};

export const calculateOppositeVectorToPointWithBounds = ({
  pointSource,
  pointCenter,
  bounds,
  ratio = 1,
}: {
  pointSource: number[];
  pointCenter: number[];
  bounds: {
    x: {
      min: number;
      max: number;
    };
    y: {
      min: number;
      max: number;
    };
  };
  ratio?: number;
}) => {
  const localX = pointSource[0] - pointCenter[0];
  const localY = pointSource[1] - pointCenter[1];
  const maxLocalX = Math.max(
    pointCenter[0] - bounds.x.min * ratio,
    bounds.x.max * ratio - pointCenter[0],
  );
  const maxLocalY = Math.max(
    pointCenter[1] - bounds.y.min * ratio,
    bounds.y.max * ratio - pointCenter[1],
  );
  const normalX = localX / maxLocalX;
  const normalY = localY / maxLocalY;

  let distance = Math.sqrt(Math.pow(normalX, 2) + Math.pow(normalY, 2));

  distance = Math.min(distance, 1);

  // This tweaks the center pull/distance dependency factor
  const strength = Math.pow(1 - distance, 3);
  const length = Math.sqrt(Math.pow(normalX, 2) + Math.pow(normalY, 2));

  if (length === 0) {
    return [0, 0];
  }

  const directionNormalX = normalX / length;
  const directionNormalY = normalY / length;

  return [-directionNormalX * strength * maxLocalX, -directionNormalY * strength * maxLocalY];
};

export function bendCurve(
  curve: CatmullRomCurve3,
  start: Vector3,
  end: Vector3,
  directionRatios: number[],
  level: number = 80,
  controlPoints: number = 4,
) {
  const points = [];
  const direction = new Vector3().subVectors(end, start);

  // Perpendicular vector for arching along X/Y plane
  const up = new Vector3(directionRatios[0], directionRatios[1], 0); // Choose axis perpendicular to direction
  const perp = new Vector3().crossVectors(direction, up).normalize();

  // Generate control points with sinusoidal offset for arch
  for (let i = 0; i <= controlPoints; i++) {
    const distance = i / controlPoints;
    const point = start.clone().add(direction.clone().multiplyScalar(distance));

    // Sinusoidal lateral offset, peaking at the middle
    const archOffset = Math.sin(distance * Math.PI) * level;

    point.add(perp.clone().multiplyScalar(archOffset));
    points.push(point);
  }

  curve.points = points;
}

export const getDirectionRatios = (target: number[], source: number[]) => {
  const distanceX = target[0] - source[0];
  const distanceY = target[1] - source[1];
  const angle = Math.atan2(distanceX, distanceY);
  const ratioX = Math.cos(angle);
  const ratioY = Math.sin(angle);

  return [ratioX, -ratioY];
};

export function addNoiseToCurve(
  curve: CatmullRomCurve3,
  intensity: number,
  timestamp: number,
  segments: number = 8,
  frequency: number = 2,
  speed: number = 16,
) {
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const distance = i / segments;

    // Base point on curve
    const point = curve.getPoint(distance);
    const tangent = curve.getTangent(distance).normalize();

    // Two perpendicular vectors for 2D wobble
    let up = new Vector3(0, 1, 0);

    if (Math.abs(tangent.dot(up)) > 0.9) {
      up.set(1, 0, 0);
    }

    const normal = new Vector3().crossVectors(tangent, up).normalize();
    const binormal = new Vector3().crossVectors(tangent, normal).normalize();

    // Stronger peak in the middle
    const falloff = Math.sin(distance * Math.PI);

    // 2D sine/cos waves
    const waveX = Math.sin(distance * frequency * Math.PI * 2 + timestamp * speed);
    const waveY = Math.cos(distance * frequency * Math.PI * 2 + timestamp * speed * 0.7);

    const noisyPoint = point
      .clone()
      .addScaledVector(normal, waveX * intensity * falloff)
      .addScaledVector(binormal, waveY * intensity * falloff);

    points.push(noisyPoint);
  }

  curve.points = points;
}

export const generate6PointStarGeometry = (size: number) => {
  const coreSize = size * 0.2;
  const spikeLength = size * 0.23;
  const halfSize = coreSize / 2;
  const geometry = new BufferGeometry();
  const box = new BoxGeometry(coreSize, coreSize, coreSize);
  const baseVertices: Vector3[] = [];
  const vertices: number[] = [];
  const indices: number[] = [];
  // Add spikes for each cube face center
  const spikeDirections = [
    new Vector3(1, 0, 0),
    new Vector3(-1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, -1, 0),
    new Vector3(0, 0, 1),
    new Vector3(0, 0, -1),
  ];

  for (let i = 0; i < box.attributes.position.count; i++) {
    baseVertices.push(new Vector3().fromBufferAttribute(box.attributes.position, i));
  }

  // Add cube vertices to vertices array
  baseVertices.forEach((v) => vertices.push(v.x, v.y, v.z));

  // Copy box faces (indices)
  if (box.index) {
    indices.push(...box.index.array);
  } else {
    // create indices if BoxGeometry doesn't have them
    for (let i = 0; i < box.attributes.position.count; i += 3) {
      indices.push(i, i + 1, i + 2);
    }
  }

  box.dispose();

  spikeDirections.forEach((dir) => {
    // Tip of pyramid
    const tip = new Vector3(
      dir.x * (halfSize + spikeLength),
      dir.y * (halfSize + spikeLength),
      dir.z * (halfSize + spikeLength),
    );
    const tipIndex = vertices.length / 3;
    const faceVertices: number[] = [];

    vertices.push(tip.x, tip.y, tip.z);
    // Determine the four cube vertices on the face corresponding to this spike
    baseVertices.forEach((v, idx) => {
      // If vertex is on the cube face along this direction, include it
      if (dir.x !== 0 && Math.abs(v.x - dir.x * halfSize) < 1e-6) {
        faceVertices.push(idx);
      } else if (dir.y !== 0 && Math.abs(v.y - dir.y * halfSize) < 1e-6) {
        faceVertices.push(idx);
      } else if (dir.z !== 0 && Math.abs(v.z - dir.z * halfSize) < 1e-6) {
        faceVertices.push(idx);
      }
    });

    // Make 4 triangles connecting tip to face vertices
    for (let i = 0; i < 4; i++) {
      indices.push(faceVertices[i], faceVertices[(i + 1) % 4], tipIndex);
    }
  });

  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
};

const generateSpiralCurve = ({
  radiusStart = 1,
  radiusEnd = 3,
  heightStart = 0,
  heightEnd = 5,
  turns = 2,
  pointsCount = 24,
} = {}) => {
  const points: Vector3[] = [];

  for (let i = 0; i <= pointsCount; i++) {
    const t = i / pointsCount;
    const radius = MathUtils.lerp(radiusStart, radiusEnd, t);
    const y = MathUtils.lerp(heightStart, heightEnd, t);
    const angle = 2 * Math.PI * turns * t;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);

    points.push(new Vector3(x, y, z));
  }

  return new CatmullRomCurve3(points);
};

export const generateSpiralGeometry = (size: number, factor: number) => {
  const radiusSize = (size * 0.67) / 2;
  const height = Math.floor(radiusSize * factor);
  const curve = generateSpiralCurve({
    radiusEnd: radiusSize,
    heightStart: -height,
    heightEnd: height,
  });

  const geometry = new TubeGeometry(
    curve,
    40,
    // Magic number, eyeballing the width based on the provided size
    SHAPES_LINE_WIDTH * (radiusSize * 0.03),
    8,
    false,
  );

  return geometry;
};

export const updateSpiralGeometry = (geometry: TubeGeometry, size: number, factor: number) => {
  const radiusSize = (size * 0.67) / 2;
  const height = Math.floor(radiusSize * factor);
  const curve = generateSpiralCurve({
    radiusEnd: radiusSize,
    heightStart: -height,
    heightEnd: height,
  });
  const tubularSegments = geometry.parameters.tubularSegments;
  const radialSegments = geometry.parameters.radialSegments;
  const radius = geometry.parameters.radius;

  // Recompute Frenet frames
  const frames = curve.computeFrenetFrames(tubularSegments, geometry.parameters.closed);
  const positions = geometry.attributes.position.array;

  let vertexIndex = 0;

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const point = curve.getPointAt(t);
    const normal = frames.normals[i];
    const binormal = frames.binormals[i];

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2;

      const sin = Math.sin(v);
      const cos = -Math.cos(v);

      const nx = (cos * normal.x + sin * binormal.x) * radius;
      const ny = (cos * normal.y + sin * binormal.y) * radius;
      const nz = (cos * normal.z + sin * binormal.z) * radius;

      positions[vertexIndex++] = point.x + nx;
      positions[vertexIndex++] = point.y + ny;
      positions[vertexIndex++] = point.z + nz;
    }
  }

  geometry.attributes.position.needsUpdate = true;
  //geometry.computeBoundingSphere(); // optional but recommended
};

const generateCubeGeometry = (size: number) => {
  const cubeSize = size * 0.5;

  return new BoxGeometry(cubeSize, cubeSize, cubeSize);
};

const generatePyramidGeometry = (size: number) => {
  const pyramidSize = size * 0.37;

  return new TetrahedronGeometry(pyramidSize);
};

const createLineCapShape = (radiusSize: number) => {
  // Generate a slightly rounded shape, tube-like
  const roundedRadiusSize = radiusSize * 0.7;
  const shape = new Shape();

  shape.moveTo(-radiusSize, 0);
  shape.lineTo(-roundedRadiusSize, -roundedRadiusSize);
  shape.lineTo(0, -radiusSize);
  shape.lineTo(roundedRadiusSize, -roundedRadiusSize);
  shape.lineTo(radiusSize, 0);
  shape.lineTo(roundedRadiusSize, roundedRadiusSize);
  shape.lineTo(0, radiusSize);
  shape.lineTo(-roundedRadiusSize, roundedRadiusSize);
  shape.closePath();

  return shape;
};

const generateLinearSineWavePoints = ({
  pointsCount = 24,
  length,
  startX,
  amplitude,
  waves = 2,
  timestamp,
  speed = 24,
}: {
  pointsCount?: number;
  length: number;
  startX: number;
  amplitude: number;
  waves?: number;
  timestamp: number;
  speed?: number;
}) => {
  const points = [];

  for (let i = 0; i < pointsCount; i++) {
    const distance = i / (pointsCount - 1);
    const x = startX + distance * length;
    const y = Math.sin(distance * Math.PI * 2 * waves + timestamp * speed) * amplitude;
    const z = 0;

    points.push(new Vector3(x, y, z));
  }

  return points;
};

const createOrientedShapeExtrusionAlongPoints = (shape: Shape, curvePoints: Vector3[]) => {
  const shapePoints = shape.getPoints();
  const shapeCount = shapePoints.length;
  const curveCount = curvePoints.length;
  const vertices = new Float32Array(curveCount * shapeCount * 3);
  const indices: number[] = [];

  for (let i = 0; i < curveCount; i++) {
    const point = curvePoints[i];
    const nextPoint = curvePoints[Math.min(i + 1, curveCount - 1)];
    const tangent = new Vector3().subVectors(nextPoint, point).normalize();
    const up = new Vector3(0, 0, 1);
    const binormal = new Vector3().crossVectors(tangent, up).normalize();
    const normal = new Vector3().crossVectors(binormal, tangent).normalize();

    for (let j = 0; j < shapeCount; j++) {
      const shapePoint = shapePoints[j];
      const vertex = new Vector3()
        .copy(point)
        .addScaledVector(normal, shapePoint.y)
        .addScaledVector(binormal, shapePoint.x);

      const index = (i * shapeCount + j) * 3;

      vertices[index + 0] = vertex.x;
      vertices[index + 1] = vertex.y;
      vertices[index + 2] = vertex.z;
    }
  }

  for (let i = 0; i < curveCount - 1; i++) {
    for (let j = 0; j < shapeCount - 1; j++) {
      const a = i * shapeCount + j;
      const b = (i + 1) * shapeCount + j;
      const c = b + 1;
      const d = a + 1;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new BufferGeometry();

  geometry.setAttribute("position", new BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  //geometry.computeVertexNormals();

  return geometry;
};

const updateExtrudedGeometry = (geometry: BufferGeometry, curvePoints: Vector3[], shape: Shape) => {
  const shapePoints = shape.getPoints(); // array of Vector2
  const curveCount = curvePoints.length;
  const shapeCount = shapePoints.length;

  const vertices = geometry.attributes.position.array;

  for (let i = 0; i < curveCount; i++) {
    const p = curvePoints[i];

    // Tangent approximation
    const next = curvePoints[Math.min(i + 1, curveCount - 1)];
    const tangent = new Vector3().subVectors(next, p).normalize();

    const up = new Vector3(0, 0, 1);
    const binormal = new Vector3().crossVectors(tangent, up).normalize();
    const normal = new Vector3().crossVectors(binormal, tangent).normalize();

    for (let j = 0; j < shapeCount; j++) {
      const sp = shapePoints[j];
      const idx = (i * shapeCount + j) * 3;

      // local frame transform: p + normal * sp.y + binormal * sp.x
      const vertex = new Vector3()
        .copy(p)
        .addScaledVector(normal, sp.y)
        .addScaledVector(binormal, sp.x);

      vertices[idx + 0] = vertex.x;
      vertices[idx + 1] = vertex.y;
      vertices[idx + 2] = vertex.z;
    }
  }

  geometry.attributes.position.needsUpdate = true;
  //geometry.computeVertexNormals(); // optional, for correct lighting
};

const generateSineLineGeometry = (size: number, timestamp: number) => {
  const length = size * 0.5;
  const radiusSize = SHAPES_LINE_WIDTH * (((size * 0.67) / 2) * 0.03);
  const shape = createLineCapShape(radiusSize);
  const curvePoints = generateLinearSineWavePoints({
    length,
    amplitude: radiusSize * 1.5,
    startX: -length / 2,
    timestamp,
  });

  return createOrientedShapeExtrusionAlongPoints(shape, curvePoints);
};

export const updateLineGeometry = (geometry: BufferGeometry, size: number, timestamp: number) => {
  const length = size * 0.5;
  const radiusSize = SHAPES_LINE_WIDTH * (((size * 0.67) / 2) * 0.03);
  const curvePoints = generateLinearSineWavePoints({
    length,
    amplitude: radiusSize * 1.5,
    startX: -length / 2,
    timestamp,
  });
  const shape = createLineCapShape(radiusSize);

  updateExtrudedGeometry(geometry, curvePoints, shape);
};

export const getRandomParticleGeometryName = (): (typeof PARTICLE_GEOMETRY_NAMES)[number] =>
  PARTICLE_GEOMETRY_NAMES[Math.floor(Math.random() * PARTICLE_GEOMETRY_NAMES.length)];
export const getGeometryByName = (
  name: (typeof PARTICLE_GEOMETRY_NAMES)[number],
  size: number,
  timestamp: number,
  factor: number,
) => {
  switch (name) {
    case "spike":
      return generate6PointStarGeometry(size);
    case "spiral":
      return generateSpiralGeometry(size, factor);
    case "cube":
      return generateCubeGeometry(size);
    case "pyramid":
      return generatePyramidGeometry(size);
    case "line":
      return generateSineLineGeometry(size, timestamp);
  }
};
