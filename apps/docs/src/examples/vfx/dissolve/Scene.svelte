<script>
  import { T, useTask, useThrelte } from '@threlte/core'
  import { interactivity } from '@threlte/extras'
  import {
    dissolveOpacityNode,
    wavesPositionNode,
    wavesNormalNode,
    wavesEmissiveNode,
    Waves
  } from '@threlte/vfx'
  import { Button, Pane } from 'svelte-tweakpane-ui'
  import { Spring } from 'svelte/motion'

  interactivity()

  const scale = new Spring(1)

  let rotation = $state(0)
  useTask((delta) => {
    rotation += delta
  })
</script>

<T.PerspectiveCamera
  makeDefault
  position={[5, 5, 5]}
  oncreate={(ref) => {
    ref.lookAt(0, 1, 0)
  }}
/>

<T.DirectionalLight
  position={[0, 10, 10]}
  castShadow
/>

<!-- <T.Mesh
  rotation.y={rotation}
  position.y={1}
  scale={scale.current}
  onpointerenter={() => {
    scale.target = 1.5
  }}
  onpointerleave={() => {
    scale.target = 1
  }}
  castShadow
>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardNodeMaterial
    color="hotpink"
    opacityNode={dissolveOpacityNode}
    transparent
  />
</T.Mesh> -->

<T.Mesh
  rotation.x={-Math.PI / 2}
  receiveShadow
>
  <T.PlaneGeometry args={[2, 2, 256, 256]} />
  <Waves />
</T.Mesh>

<Pane position="fixed">
  <Button
    on:click={() => {
      console.log(renderer)
      console.log(renderer.info)
    }}>test</Button
  >
</Pane>
