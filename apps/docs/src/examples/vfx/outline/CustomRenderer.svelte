<script lang="ts">
  import { useTask, useThrelte } from '@threlte/core'
  import { PostProcessing, type WebGPURenderer } from 'three/webgpu'
  import { pass, uniform } from 'three/tsl'
  import { outline } from 'three/addons/tsl/display/OutlineNode.js'
  import { state } from './state.svelte'

  const { scene, renderer, camera, renderStage } = useThrelte<WebGPURenderer>()

  const edgeGlow = uniform(0.0)
  const edgeThickness = uniform(1.0)

  const postprocessing = new PostProcessing(renderer)
  postprocessing.outputNode = outline(scene, camera.current, {
    selectedObjects: state.selectedObjects,
    edgeGlow,
    edgeThickness
  }).add(pass(scene, camera.current))

  $inspect(state.selectedObjects)

  $effect(() => {
    return () => {
      postprocessing.dispose()
    }
  })

  // $effect(() => {
  //   const last = autoRender.current
  //   autoRender.set(false)
  //   return () => {
  //     autoRender.set(last)
  //   }
  // })

  useTask(
    () => {
      postprocessing.render()
    },
    { stage: renderStage }
  )
</script>
