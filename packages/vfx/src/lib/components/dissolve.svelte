<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
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
	const { invalidate } = useThrelte();

	const noiseValue = mx_noise_float(uv().mul(multiplier), amplitude, pivot);
	const threshold = uniform(t);
	const dissolveOpacityNode = step(threshold, noiseValue);
	const dissolveCastShadowNode = dissolveOpacityNode.oneMinus();

	const { start, stop, started } = useTask(() => {
		threshold.value = t;
	});

	$effect(() => {
		if (t === 0 || t === 1) {
			threshold.value = t;
			invalidate();
			stop();
		} else if (!$started) {
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
