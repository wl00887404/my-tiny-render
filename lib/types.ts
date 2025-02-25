export type Matrix = number[][];
export type Vector = number[][];
export type Quaternion = number[];

export type Face = {
  points: Vector[];
  color: string;
};
export type Primitive = Face[];
