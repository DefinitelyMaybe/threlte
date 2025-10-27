<script lang="ts">
  import { useTask, useThrelte } from '@threlte/core'
  import { PostProcessing, Color, type WebGPURenderer } from 'three/webgpu'
  import { pass, uniform } from 'three/tsl'
  import { outline } from 'three/addons/tsl/display/OutlineNode.js'
  import { state } from './state.svelte'

  const { scene, renderer, camera, renderStage } = useThrelte<WebGPURenderer>()

  const edgeStrength = uniform(3.0)
  const edgeGlow = uniform(0.0)
  const edgeThickness = uniform(1.0)
  // const pulsePeriod = uniform(0)
  const visibleEdgeColor = uniform(new Color(0xffffff))
  const hiddenEdgeColor = uniform(new Color(0x4e3636))

  const outlinePass = outline(scene, camera.current, {
    selectedObjects: [],
    edgeGlow,
    edgeThickness
  })
  const { visibleEdge, hiddenEdge } = outlinePass

  // const period = time.div(pulsePeriod).mul(2)
  // const osc = oscSine(period).mul(0.5).add(0.5) // osc [ 0.5, 1.0 ]

  const outlineColor = visibleEdge
    .mul(visibleEdgeColor)
    .add(hiddenEdge.mul(hiddenEdgeColor))
    .mul(edgeStrength)
  // const outlinePulse = pulsePeriod.greaterThan(0).select(outlineColor.mul(osc), outlineColor)

  const scenePass = pass(scene, camera.current)

  const postprocessing = new PostProcessing(renderer)
  postprocessing.outputNode = outlineColor.add(scenePass)

  $effect(() => {
    outlinePass.selectedObjects = state.selectedObjects
  })

  $effect(() => {
    return () => {
      postprocessing.dispose()
    }
  })

  useTask(
    () => {
      postprocessing.render()
    },
    { stage: renderStage, autoInvalidate: false }
  )
</script>
