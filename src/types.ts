export const shape = {rectangle: 'rectangle'} as const;
export type ShapeType = keyof typeof shape;

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}