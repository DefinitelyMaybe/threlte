import type {
  CoefficientCombineRule,
  ColliderDesc,
  Collider as RapierCollider
} from '@dimforge/rapier3d-compat'
import { type Snippet } from 'svelte'
import type { Euler, Vector3 } from 'three'
import type { ColliderEvents } from '../../../types/types'

// ------------------ BASE ------------------

type Type = 'static' | 'dynamic'

type BaseProps = {
  type?: Type
  restitution?: number
  restitutionCombineRule?: CoefficientCombineRule
  friction?: number
  frictionCombineRule?: CoefficientCombineRule
  sensor?: boolean
  collider?: RapierCollider
  contactForceEventThreshold?: number
  refresh?: () => void
}

// ------------------ SHAPE ------------------

export type Shape =
  | 'ball'
  | 'capsule'
  | 'segment'
  | 'triangle'
  | 'roundTriangle'
  | 'polyline'
  | 'trimesh'
  | 'cuboid'
  | 'roundCuboid'
  | 'heightfield'
  | 'cylinder'
  | 'roundCylinder'
  | 'cone'
  | 'roundCone'
  | 'convexHull'
  | 'convexMesh'
  | 'roundConvexHull'
  | 'roundConvexMesh'

type Args<TShape extends Shape> = Parameters<(typeof ColliderDesc)[TShape]>

type ShapeProps<TShape extends Shape> = {
  shape: TShape
  args: Args<TShape>
}

// ------------------ MASS ------------------

type Density = {
  density: number
  mass?: never
  centerOfMass?: never
  principalAngularInertia?: never
  angularInertiaLocalFrame?: never
}
type Mass = {
  mass: number
  density?: never
  centerOfMass?: never
  principalAngularInertia?: never
  angularInertiaLocalFrame?: never
}
type MassProperties = {
  mass: number
  centerOfMass: Parameters<Vector3['set']>
  principalAngularInertia: Parameters<Vector3['set']>
  angularInertiaLocalFrame: Parameters<Euler['set']>
  density?: never
}

type NoMassProperties = {
  density?: never
  mass?: never
  centerOfMass?: never
  principalAngularInertia?: never
  angularInertiaLocalFrame?: never
}

export type MassDef = Density | Mass | MassProperties | NoMassProperties

type MassProps<TMassDef extends MassDef> = TMassDef extends Density
  ? Density
  : TMassDef extends MassProperties
    ? MassProperties
    : TMassDef extends Mass
      ? Mass
      : NoMassProperties

// ------------------ COLLIDER ------------------

export type ColliderProps<TShape extends Shape, TMassDef extends MassDef> = BaseProps &
  ColliderEvents &
  ShapeProps<TShape> &
  MassProps<TMassDef> & {
    children?: Snippet<[{ collider?: RapierCollider }]>
  }
