import * as mathUtils from "../utils/mathUtils";

class BigMNumber {
  readonly number: number;
  readonly mFactor: number;

  constructor(number: number = 0, mFactor: number = 0) {
    this.number = number;
    this.mFactor = mFactor;
  }

  toString(): string {
    if (this.mFactor != 0) {
      let str = `${this.mFactor}M`;
      if (this.number != 0) {
        str += this.number > 0 ? `+${this.number}` : `${this.number}`;
      }
      return str;
    } else {
      return this.number.toString();
    }
  }

  add(other: BigMNumber) {
    return new BigMNumber(
      this.number + other.number,
      this.mFactor + other.mFactor
    );
  }

  sub(other: BigMNumber) {
    return new BigMNumber(
      this.number - other.number,
      this.mFactor - other.mFactor
    );
  }

  mult(other: number) {
    return new BigMNumber(this.number * other, this.mFactor * other);
  }

  div(other: number) {
    return new BigMNumber(this.number / other, this.mFactor / other);
  }

  gcd(other: number) {
    return mathUtils.gcd(
      mathUtils.gcd(Math.abs(this.number), Math.abs(this.mFactor)),
      Math.abs(other)
    );
  }

  compare(other: number | BigMNumber) {
    if (other instanceof BigMNumber) {
      if (this.mFactor > other.mFactor) return 1;
      if (this.mFactor < other.mFactor) return -1;
      if (this.number > other.number) return 1;
      if (this.number < other.number) return -1;
      return 0;
    } else {
      if (this.mFactor > 0) return 1;
      if (this.mFactor < 0) return -1;
      if (this.number > other) return 1;
      if (this.number < other) return -1;
      return 0;
    }
  }
}

// Solves a linear optimization problem in its standard form. https://en.wikipedia.org/wiki/Linear_programming
// Solution using the simplex algorithm. https://en.wikipedia.org/wiki/Simplex_algorithm
// TODO: With Big M augmentations https://en.wikipedia.org/wiki/Big_M_method
export function solveLinearOptimization(
  objective: number[],
  constraintMatrix: number[][], // row-major
  constraint: number[],
  log: ((line: any) => any) | null = null
): number[] {
  return []; // TODO
}
