<script>
  import { T } from '@threlte/core'
  import { CameraControls } from '@threlte/extras'
  import { Dissolve } from '@threlte/vfx'
  import { Button, Pane } from 'svelte-tweakpane-ui'
  import { Tween } from 'svelte/motion'
  const x = new Tween(0, { duration: 1000 })
</script>

<T.PerspectiveCamera
  makeDefault
  position={[5, 5, 5]}
  oncreate={(ref) => {
    ref.lookAt(0, 1, 0)
  }}
>
  <CameraControls />
</T.PerspectiveCamera>

<T.DirectionalLight
  position={[0, 10, 10]}
  castShadow
/>

<T.Mesh
  position.y={1}
  castShadow
>
  <T.BoxGeometry args={[1, 2, 1]} />
  <Dissolve
    bind:t={x.current}
    color="hotpink"
    multiplier={5}
  />
</T.Mesh>

<T.Mesh
  rotation.x={-Math.PI / 2}
  receiveShadow
>
  <T.CircleGeometry args={[3]} />
  <T.MeshStandardNodeMaterial />
</T.Mesh>

<Pane position="fixed">
  <Button
    title="Dissolve"
    on:click={() => {
      if (x.current == 0) {
        x.target = 1
      } else {
        x.target = 0
      }
    }}
  ></Button>
</Pane>
