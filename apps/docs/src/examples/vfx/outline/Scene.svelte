<script lang="ts">
  import type { Object3D } from 'three'
  import { CameraControls, interactivity, type IntersectionEvent } from '@threlte/extras'
  import { T } from '@threlte/core'
  import { state } from './state.svelte'

  interactivity()
</script>

<T.PerspectiveCamera
  makeDefault
  position={[10, 10, 10]}
>
  <CameraControls />
</T.PerspectiveCamera>

<T.DirectionalLight />
<T.AmbientLight />

<T.Mesh
  onclick={(ref: IntersectionEvent<Object3D>) => {
    state.selectedObjects = [ref.object]
  }}
>
  <T.MeshStandardMaterial color="gold" />
  <T.BoxGeometry />
</T.Mesh>

<T.Mesh
  scale={10}
  position.y={-0.51}
  rotation.x={-Math.PI / 2}
>
  <T.PlaneGeometry />
  <T.MeshStandardMaterial color="green" />
</T.Mesh>
