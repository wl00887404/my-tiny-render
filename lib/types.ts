export type Matrix = number[][];
export type Vector = number[][];

export type Color = number[];
export type Face = {
  points: Vector[];
  color: Color;
};
export type Primitive = Face[];
