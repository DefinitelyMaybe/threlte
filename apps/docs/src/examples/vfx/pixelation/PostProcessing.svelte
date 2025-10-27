<script lang="ts">
  import { useTask, useThrelte } from '@threlte/core'
  import { PostProcessing, Vector2, Vector3, Quaternion, type WebGPURenderer } from 'three/webgpu'
  import { uniform } from 'three/tsl'
  import { pixelationPass } from 'three/addons/tsl/display/PixelationPassNode.js'

  const { scene, renderer, camera, renderStage } = useThrelte<WebGPURenderer>()

  const pixelSize = uniform(6)
  const normalEdgeStrength = uniform(0.3)
  const depthEdgeStrength = uniform(0.4)
  const pixelAlignedPanning = true

  const scenePass = pixelationPass(
    scene,
    camera.current,
    pixelSize,
    normalEdgeStrength,
    depthEdgeStrength
  )

  const postprocessing = new PostProcessing(renderer)
  postprocessing.outputNode = scenePass

  $effect(() => {
    return () => {
      postprocessing.dispose()
    }
  })

  useTask(
    () => {
      const rendererSize = renderer.getSize(new Vector2())
      const aspectRatio = rendererSize.x / rendererSize.y

      if (pixelAlignedPanning) {
        const pixelS = pixelSize.value

        pixelAlignFrustum(
          camera.current,
          aspectRatio,
          Math.floor(rendererSize.x / pixelS),
          Math.floor(rendererSize.y / pixelS)
        )
      } else if (camera.current.left != -aspectRatio || camera.current.top != 1.0) {
        // Reset the Camera Frustum if it has been modified
        camera.current.left = -aspectRatio
        camera.current.right = aspectRatio
        camera.current.top = 1.0
        camera.current.bottom = -1.0
        camera.current.updateProjectionMatrix()
      }
      postprocessing.render()
    },
    { stage: renderStage, autoInvalidate: false }
  )

  function pixelAlignFrustum(camera, aspectRatio, pixelsPerScreenWidth, pixelsPerScreenHeight) {
    // 0. Get Pixel Grid Units
    const worldScreenWidth = (camera.right - camera.left) / camera.zoom
    const worldScreenHeight = (camera.top - camera.bottom) / camera.zoom
    const pixelWidth = worldScreenWidth / pixelsPerScreenWidth
    const pixelHeight = worldScreenHeight / pixelsPerScreenHeight

    // 1. Project the current camera position along its local rotation bases
    const camPos = new Vector3()
    camera.getWorldPosition(camPos)
    const camRot = new Quaternion()
    camera.getWorldQuaternion(camRot)
    const camRight = new Vector3(1.0, 0.0, 0.0).applyQuaternion(camRot)
    const camUp = new Vector3(0.0, 1.0, 0.0).applyQuaternion(camRot)
    const camPosRight = camPos.dot(camRight)
    const camPosUp = camPos.dot(camUp)

    // 2. Find how far along its position is along these bases in pixel units
    const camPosRightPx = camPosRight / pixelWidth
    const camPosUpPx = camPosUp / pixelHeight

    // 3. Find the fractional pixel units and convert to world units
    const fractX = camPosRightPx - Math.round(camPosRightPx)
    const fractY = camPosUpPx - Math.round(camPosUpPx)

    // 4. Add fractional world units to the left/right top/bottom to align with the pixel grid
    camera.left = -aspectRatio - fractX * pixelWidth
    camera.right = aspectRatio - fractX * pixelWidth
    camera.top = 1.0 - fractY * pixelHeight
    camera.bottom = -1.0 - fractY * pixelHeight
    camera.updateProjectionMatrix()
  }
</script>
