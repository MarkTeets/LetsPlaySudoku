// Utilities
import { pencilStringSolutionExecuter } from '../puzzle-solution-functions/pencilStringSolutionExecuter';
import { hiddenPairSolver } from '../puzzle-solution-functions/hiddenSubsetSolver';

const hiddenPairPencilStringExample1 = 'C346C424C613C826C9123';
const hiddenPairPencilStringResult1 = 'C346C424C613C826C913';

const hiddenPairPencilStringExample2 = 'E238E338E417E525E6125E879E919';
const hiddenPairPencilStringResult2 = 'E238E338E417E525E625E879E919';

describe('Hidden pair solver solves test cases', () => {
  it('should remove extra penciled in values from row example 1', () => {
    expect(pencilStringSolutionExecuter(hiddenPairSolver, hiddenPairPencilStringExample1)).toBe(
      hiddenPairPencilStringResult1
    );
  });

  it('should remove extra penciled in values from row example 2', () => {
    expect(pencilStringSolutionExecuter(hiddenPairSolver, hiddenPairPencilStringExample2)).toBe(
      hiddenPairPencilStringResult2
    );
  });
});
