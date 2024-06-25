import type { Snippet, SvelteComponent } from 'svelte'
import type { Object3D } from 'three'

export type HierarchicalObjectProperties = {
  object?: Object3D
  onChildMount?: (child: Object3D) => void
  onChildDestroy?: (child: Object3D) => void
  children: Snippet
}

export default class HierarchicalObject extends SvelteComponent<HierarchicalObjectProperties> {}
