<script lang="ts">
  import PostProcessing from './PostProcessing.svelte'
  import Scene from './Scene.svelte'
  import { Canvas, extend } from '@threlte/core'
  import { WebGPURenderer } from 'three/webgpu'
  import * as THREE from 'three/webgpu'
  extend(THREE)
</script>

<Canvas
  createRenderer={(canvas: HTMLCanvasElement) => {
    return new WebGPURenderer({
      canvas
    })
  }}
>
  <Scene />
  <PostProcessing />
</Canvas>
