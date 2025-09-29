<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { Instance, InstancedMesh } from '@threlte/extras'

  interface FireProps {
    count: number
  }
  let { count = 10 }: FireProps = $props()

  let dn = $state(Date.now())
  useTask(() => (dn = Date.now()))
</script>

<InstancedMesh>
  <T.SphereGeometry args={[0.5]} />
  <T.MeshStandardMaterial color="white" />

  {#each { length: count } as _, i}
    <Instance
      position.x={Math.random() * i}
      position.y={Math.sin(dn / 1000 + 40)}
    />
  {/each}
</InstancedMesh>
