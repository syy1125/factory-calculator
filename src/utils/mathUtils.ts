export function gcd(a: number, b: number): number {
  console.assert(a >= 0 && b >= 0);
  if (a < b) return gcd(b, a);
  if (b === 0) return a;
  return gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}
