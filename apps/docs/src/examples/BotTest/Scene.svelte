<script lang="ts">
  import { T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
</script>

<T.PerspectiveCamera
  position={[5, 5, 5]}
  makeDefault
>
  <OrbitControls
    enableZoom={true}
    enableDamping={true}
    target={[0, 0.5, 0]}
  />
</T.PerspectiveCamera>

<!-- Add more light to clearly see the cube -->
<T.DirectionalLight
  position={[3, 10, 10]}
  intensity={1.5}
/>
<T.AmbientLight intensity={0.4} />

<!-- Position the cube slightly above ground level -->
<T.Mesh position={[0, 0.5, 0]}>
  <T.BoxGeometry />
  <T.MeshStandardMaterial color="#ff3e00" />
</T.Mesh>

<!-- Add a ground plane to help with perspective -->
<T.Mesh
  rotation={[-Math.PI / 2, 0, 0]}
  position={[0, -0.01, 0]}
>
  <T.PlaneGeometry args={[10, 10]} />
  <T.MeshStandardMaterial color="#f0f0f0" />
</T.Mesh>
