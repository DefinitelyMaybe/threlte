<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { Group, MeshStandardMaterial, BoxGeometry, Mesh, MathUtils } from 'three'

  interface FirefliesProps {
    amount: number
  }
  let { amount = 20 }: FirefliesProps = $props()

  const container = new Group()

  function createFireFly() {
    let geometry = new BoxGeometry()
    let material = new MeshStandardMaterial({ color: 0xfee685, transparent: true, opacity: 1 })

    let mesh = new Mesh(geometry, material)
    mesh.position.x = (Math.random() * 2 - 1) * 10
    mesh.position.y = (Math.random() * 2 - 1) * 10
    mesh.position.z = (Math.random() * 2 - 1) * 10

    mesh.scale.setScalar(Math.random() * 0.2 + 0.2)

    mesh.userData = {
      blinkOffset: Math.random() * 2
    }
    container.add(mesh)
  }

  for (let i = 0; i < amount; i++) {
    createFireFly()
  }

  console.log(container)

  function interpolate(t: number) {
    if (t < 0.60526315) return ((-0.0017269750000000002 - 0) / (0.60526315 - 0)) * (t - 0) + 0
    if (t < 0.74473685)
      return (
        ((0.993009875 - -0.0017269750000000002) / (0.74473685 - 0.60526315)) * (t - 0.60526315) +
        -0.0017269750000000002
      )
    return ((1.00526315 - 0.993009875) / (1 - 0.74473685)) * (t - 0.74473685) + 0.993009875
  }

  let t = 0

  useTask((delta) => {
    t += delta
    for (let i = 0; i < container.children.length; i++) {
      const firefly = container.children[i] as Mesh<BoxGeometry, MeshStandardMaterial>
      firefly.material.opacity = MathUtils.clamp(Math.sin(t + firefly.userData.blinkOffset), 0, 1)
      // console.log(Math.sin(opacity - delta))
      // firefly.getObjectByName("mat")
      // const { x, y, z } = firefly.position
      // firefly.position.set(x + delta, y, z + delta)
    }
  })
</script>

<T is={container} />
