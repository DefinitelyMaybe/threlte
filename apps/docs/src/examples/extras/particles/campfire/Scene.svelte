<script lang="ts">
  import { T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import Fire from './fire.svelte'
</script>

<T.PerspectiveCamera
  makeDefault
  position={[5, 5, 5]}
>
  <OrbitControls />
</T.PerspectiveCamera>

<T.DirectionalLight
  position.y={10}
  position.z={5}
/>

<T.AmbientLight intensity={0.1} />

<T.Mesh>
  <T.BoxGeometry />
  <T.MeshStandardMaterial
    transparent={true}
    opacity={0.1}
  />
</T.Mesh>

<Fire />
