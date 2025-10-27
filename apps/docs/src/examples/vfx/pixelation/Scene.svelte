<script lang="ts">
  import { CameraControls } from '@threlte/extras'
  import { T, useThrelte } from '@threlte/core'
  import { Color } from 'three/webgpu'
  const { scene } = useThrelte()
  scene.background = new Color('black')
</script>

<T.PerspectiveCamera
  makeDefault
  position={[10, 10, 10]}
>
  <CameraControls />
</T.PerspectiveCamera>

<T.DirectionalLight />
<T.AmbientLight />

<T.Mesh>
  <T.MeshStandardNodeMaterial color="gold" />
  <T.BoxGeometry />
</T.Mesh>

<T.Mesh
  scale={10}
  position.y={-0.51}
  rotation.x={-Math.PI / 2}
>
  <T.PlaneGeometry />
  <T.MeshStandardNodeMaterial color="green" />
</T.Mesh>

<T.Mesh
  scale={2}
  position={[3, 0.5, 3]}
>
  <T.BoxGeometry />
  <T.MeshStandardNodeMaterial color="red" />
</T.Mesh>
