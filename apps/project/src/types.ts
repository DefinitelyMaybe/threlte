import type { Camera, CatmullRomCurve3, Shape } from "three";
import { LOGO_LETTER_RELATIVE_POINTS } from "constants";

export interface IThreeD {
  pointerPosition: {
    x: number;
    y: number;
  };
}
export type TLetter = keyof typeof LOGO_LETTER_RELATIVE_POINTS;
export type TOrigin =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ComputeExtrudedLetterGeometryAlongCurveFacingCameraAttributesProps {
  shape: Shape;
  curve: CatmullRomCurve3;
  segments?: number;
  endScale: number;
  camera: Camera | null;
  origin?: TOrigin;
  letter: TLetter;
}