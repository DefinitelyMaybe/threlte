import type { Mesh } from 'three'
import { getTeleportContext } from './context'

export const useTeleportControls = () => {
  const context = getTeleportContext()

  const addSurface = (
    mesh: Mesh,
    events: Record<string, (arg: unknown) => void>
  ) => {
    // check if the object is already in the list
    if (context.interactiveObjects.indexOf(mesh) > -1) {
      return
    }

    context.interactiveObjects.push(mesh)
    context.surfaces.set(mesh.uuid, mesh)
    context.dispatchers.set(mesh, events)
  }

  const removeSurface = (mesh: Mesh) => {
    const index = context.interactiveObjects.indexOf(mesh)
    context.interactiveObjects.splice(index, 1)
    context.surfaces.delete(mesh.uuid)
    context.dispatchers.delete(mesh)
  }

  const addBlocker = (mesh: Mesh) => {
    // check if the object is already in the list
    if (context.interactiveObjects.indexOf(mesh) > -1) {
      return
    }

    context.interactiveObjects.push(mesh)
    context.blockers.set(mesh.uuid, mesh)
  }

  const removeBlocker = (mesh: Mesh) => {
    const index = context.interactiveObjects.indexOf(mesh)
    context.interactiveObjects.splice(index, 1)
    context.blockers.delete(mesh.uuid)
  }

  return {
    addSurface,
    removeSurface,
    addBlocker,
    removeBlocker
  }
}
