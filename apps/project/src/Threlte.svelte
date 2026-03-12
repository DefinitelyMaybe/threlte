<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";

  let { pointerPosition } = $props();
</script>

<div class="wrapper">
  <Canvas renderMode="on-demand">
    <Scene {pointerPosition} />
  </Canvas>
</div>

<style lang="scss">
  .wrapper {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
