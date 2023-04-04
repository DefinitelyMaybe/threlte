<script lang="ts">
  import { T, useThrelte } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import { MOUSE, TOUCH, Color, FogExp2 } from 'three'

  const { scene } = useThrelte()

  scene.background = new Color(0xcccccc)
  scene.fog = new FogExp2(0xcccccc, 0.002)
</script>

<T.PerspectiveCamera
  makeDefault
  fov={60}
  near={0.1}
  far={1000}
  position={[400, 200, 0]}
>
  <OrbitControls
    screenSpacePanning={false}
    enableDamping={true}
    dampingFactor={0.05}
    minDistance={100}
    maxDistance={500}
    maxPolarAngle={Math.PI / 2}
    mouseButtons={{
      LEFT: MOUSE.PAN,
      RIGHT: MOUSE.ROTATE
    }}
    touches={{
      ONE: TOUCH.PAN
    }}
  />
</T.PerspectiveCamera>

<T.DirectionalLight
  position={[1, 1, 1]}
  color={0xffffff}
  intensity={0.1}
/>
<T.DirectionalLight
  position={[-1, -1, -1]}
  color={0x002288}
  intensity={10}
/>
<T.AmbientLight
  color={0x222222}
  intensity={0.1}
/>

{#each Array(500) as _}
  {@const yScale = Math.random() * 80 + 10}
  <T.Mesh
    position={[Math.random() * 1600 - 800, yScale / 2, Math.random() * 1600 - 800]}
    rotation={[0, Math.random() * Math.PI * 2, 0]}
    scale={[20, yScale, 20]}
  >
    <T.BoxGeometry />
    <T.MeshStandardMaterial
      color={0xffffff}
      flatShading={true}
    />
  </T.Mesh>
{/each}
