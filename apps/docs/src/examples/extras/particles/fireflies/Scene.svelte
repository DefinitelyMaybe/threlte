<script lang="ts">
  import { T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import Fireflies from './fireflies.svelte'
</script>

<T.PerspectiveCamera
  makeDefault
  position={[20, 20, 20]}
>
  <OrbitControls />
</T.PerspectiveCamera>

<T.AmbientLight intensity={1} />

<T.Mesh>
  <T.BoxGeometry />
  <T.MeshStandardMaterial
    transparent={true}
    opacity={0.1}
  />
</T.Mesh>

<Fireflies />
