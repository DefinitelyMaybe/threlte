import type { Object3D } from 'three'

type MyState = {
  selectedObjects: Object3D[]
}

export const state = $state<MyState>({
  selectedObjects: []
})
