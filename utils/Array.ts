export const isArraysEqual = (a1: number[], a2: number[]) => {
  return JSON.stringify(a1) === JSON.stringify(a2)
}
