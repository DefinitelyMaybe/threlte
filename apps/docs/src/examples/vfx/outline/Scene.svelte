<script lang="ts">
  import { type Object3D } from 'three'
  import { CameraControls, HTML, interactivity, type IntersectionEvent } from '@threlte/extras'
  import { T, useThrelte } from '@threlte/core'
  import { state } from './state.svelte'

  const { invalidate } = useThrelte()

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
  onpointerenter={(ref: IntersectionEvent<Object3D>) => {
    state.selectedObjects = [ref.object]
    invalidate()
  }}
  onpointerleave={() => {
    state.selectedObjects = []
    invalidate()
  }}
>
  <T.MeshStandardMaterial color="gold" />
  <T.BoxGeometry />
  <HTML
    transform
    position.y={1}
  >
    <div class="rounded-full bg-orange-500 px-3 text-white hover:opacity-90">v Hover over v</div>
  </HTML>
</T.Mesh>

<T.Mesh
  scale={10}
  position.y={-0.51}
  rotation.x={-Math.PI / 2}
>
  <T.PlaneGeometry />
  <T.MeshStandardMaterial color="green" />
</T.Mesh>

<T.Mesh
  scale={2}
  position={[3, 0.5, 3]}
>
  <T.BoxGeometry />
  <T.MeshStandardMaterial color="red" />
</T.Mesh>
