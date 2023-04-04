<script lang="ts">
  import { useTweakpane } from '../../utils/useTweakpane'
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'

  const { pane, action } = useTweakpane()

  pane.addBlade({
    view: 'text',
    text: 'Use left mouse to pan around the pusedo-city',
    lineCount: 3
  })
</script>

<div use:action />

<Canvas>
  <Scene />
</Canvas>
