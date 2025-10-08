import { mx_noise_float, oscTriangle, step, time, uv } from 'three/tsl';

const noiseValue = mx_noise_float(uv().mul(10.0), 0.5, 0.5);
const threshold = oscTriangle(time.mul(0.15));
export const dissolveOpacityNode = step(threshold, noiseValue);
