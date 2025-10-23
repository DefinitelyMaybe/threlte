<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { mx_noise_float, uniform, step, uv } from 'three/tsl';

	interface DissolveProps {
		/** A number between 0 and 1. defaults to 0. */
		t: number;
		multiplier?: number;
		amplitude?: number;
		pivot?: number;
	}
	const {
		t = $bindable(0),
		multiplier = 10,
		amplitude = 0.5,
		pivot = 0.5,
		...rest
	}: DissolveProps = $props();

	const noiseValue = mx_noise_float(uv().mul(multiplier), amplitude, pivot);
	const threshold = uniform(t);
	const dissolveOpacityNode = step(threshold, noiseValue);
	const dissolveCastShadowNode = dissolveOpacityNode.oneMinus();

	const { start, stop, started } = useTask(() => {
		threshold.value = t;
		if (t === 0 || t === 1) {
			stop();
		}
	});

	$effect(() => {
		if (!$started && !(t === 0 || t === 1)) {
			start();
		}
	});
</script>

<T.MeshStandardNodeMaterial
	{...rest}
	opacityNode={dissolveOpacityNode}
	castShadowNode={dissolveCastShadowNode}
	transparent
	castShadow
/>
