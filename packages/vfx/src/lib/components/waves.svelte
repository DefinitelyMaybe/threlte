<script lang="ts">
	import { T } from '@threlte/core';
	import {
		float,
		mx_noise_float,
		Loop,
		color,
		positionLocal,
		sin,
		vec2,
		vec3,
		mul,
		time,
		uniform,
		Fn,
		transformNormalToView
	} from 'three/tsl';

	const emissiveColor = uniform(color('#ff0a81'));
	const emissiveLow = uniform(-0.25);
	const emissiveHigh = uniform(0.2);
	const emissivePower = uniform(7);
	const largeWavesFrequency = uniform(vec2(3, 1));
	const largeWavesSpeed = uniform(1.25);
	const largeWavesMultiplier = uniform(0.15);
	const smallWavesIterations = uniform(3);
	const smallWavesFrequency = uniform(2);
	const smallWavesSpeed = uniform(0.3);
	const smallWavesMultiplier = uniform(0.18);
	const normalComputeShift = uniform(0.01);

	// TSL functions

	const wavesElevation = Fn(([position]: [typeof positionLocal]) => {
		// large waves

		const elevation = mul(
			sin(position.x.mul(largeWavesFrequency.x).add(time.mul(largeWavesSpeed))),
			sin(position.z.mul(largeWavesFrequency.y).add(time.mul(largeWavesSpeed))),
			largeWavesMultiplier
		).toVar();

		Loop({ start: float(1), end: smallWavesIterations.add(1) }, ({ i }) => {
			const noiseInput = vec3(
				position.xz
					.add(2) // avoids a-hole pattern
					.mul(smallWavesFrequency)
					.mul(i),
				time.mul(smallWavesSpeed)
			);

			const wave = mx_noise_float(noiseInput, 1, 0).mul(smallWavesMultiplier).div(i).abs();

			elevation.subAssign(wave);
		});

		return elevation;
	});

	// position

	const elevation = wavesElevation(positionLocal);
	const position = positionLocal.add(vec3(0, elevation, 0));

	// normals

	let positionA = positionLocal.add(vec3(normalComputeShift, 0, 0));
	let positionB = positionLocal.add(vec3(0, 0, normalComputeShift.negate()));

	positionA = positionA.add(vec3(0, wavesElevation(positionA), 0));
	positionB = positionB.add(vec3(0, wavesElevation(positionB), 0));

	const toA = positionA.sub(position).normalize();
	const toB = positionB.sub(position).normalize();
	const normal = toA.cross(toB);

	const wavesNormalNode = transformNormalToView(normal);

	// emissive

	const emissive = elevation.remap(emissiveHigh, emissiveLow).pow(emissivePower);
	const wavesEmissiveNode = emissiveColor.mul(emissive);
</script>

<T.MeshStandardNodeMaterial
	positionNode={position}
	emissiveNode={wavesEmissiveNode}
	normalNode={wavesNormalNode}
/>
