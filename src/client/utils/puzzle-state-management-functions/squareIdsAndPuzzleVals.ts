// Types
import {
  SquareId,
  PuzzleVal,
  BoxSquareIdsByRowsCols,
  BoxSquareIdsByPosition,
  BoxSegmentCombinationLabels,
  BoxSegmentCombinationExcludedLabel,
  BoxSegmentCombinationKey
} from '../../frontendTypes';

/**
 * Array of every SquareId from 'A1' to 'I9', utilized
 * for generating arrays with the correct typing
 */
// prettier-ignore
export const allSquareIds: SquareId[] = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9',
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9',
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9',
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9',
  'I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9'
];

export const rows: Set<SquareId>[] = [
  new Set<SquareId>(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9']),
  new Set<SquareId>(['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9']),
  new Set<SquareId>(['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9']),
  new Set<SquareId>(['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9']),
  new Set<SquareId>(['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9']),
  new Set<SquareId>(['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9']),
  new Set<SquareId>(['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9']),
  new Set<SquareId>(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9']),
  new Set<SquareId>(['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9'])
];

export const cols: Set<SquareId>[] = [
  new Set<SquareId>(['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1']),
  new Set<SquareId>(['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2']),
  new Set<SquareId>(['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3', 'I3']),
  new Set<SquareId>(['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4']),
  new Set<SquareId>(['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5', 'I5']),
  new Set<SquareId>(['A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6', 'I6']),
  new Set<SquareId>(['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7', 'I7']),
  new Set<SquareId>(['A8', 'B8', 'C8', 'D8', 'E8', 'F8', 'G8', 'H8', 'I8']),
  new Set<SquareId>(['A9', 'B9', 'C9', 'D9', 'E9', 'F9', 'G9', 'H9', 'I9'])
];

export const boxes: Set<SquareId>[] = [
  new Set<SquareId>(['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']),
  new Set<SquareId>(['A4', 'A5', 'A6', 'B4', 'B5', 'B6', 'C4', 'C5', 'C6']),
  new Set<SquareId>(['A7', 'A8', 'A9', 'B7', 'B8', 'B9', 'C7', 'C8', 'C9']),
  new Set<SquareId>(['D1', 'D2', 'D3', 'E1', 'E2', 'E3', 'F1', 'F2', 'F3']),
  new Set<SquareId>(['D4', 'D5', 'D6', 'E4', 'E5', 'E6', 'F4', 'F5', 'F6']),
  new Set<SquareId>(['D7', 'D8', 'D9', 'E7', 'E8', 'E9', 'F7', 'F8', 'F9']),
  new Set<SquareId>(['G1', 'G2', 'G3', 'H1', 'H2', 'H3', 'I1', 'I2', 'I3']),
  new Set<SquareId>(['G4', 'G5', 'G6', 'H4', 'H5', 'H6', 'I4', 'I5', 'I6']),
  new Set<SquareId>(['G7', 'G8', 'G9', 'H7', 'H8', 'H9', 'I7', 'I8', 'I9'])
];

export const rowLabels = ['r1', 'r2', 'r3'];
export const colLabels = ['c1', 'c2', 'c3'];

export const boxSegmentCombinationKeys: BoxSegmentCombinationKey[] = [
  'firstSecond',
  'firstThird',
  'secondThird'
];

export const boxSegmentCombinationRowLabels: BoxSegmentCombinationLabels = {
  firstSecond: ['r1', 'r2'],
  firstThird: ['r1', 'r3'],
  secondThird: ['r2', 'r3']
};

export const boxSegmentCombinationExcludedRowLabel: BoxSegmentCombinationExcludedLabel = {
  firstSecond: 'r3',
  firstThird: 'r2',
  secondThird: 'r1'
};

export const boxSegmentCombinationColLabels: BoxSegmentCombinationLabels = {
  firstSecond: ['c1', 'c2'],
  firstThird: ['c1', 'c3'],
  secondThird: ['c2', 'c3']
};

export const boxSegmentCombinationExcludedColLabel: BoxSegmentCombinationExcludedLabel = {
  firstSecond: 'c3',
  firstThird: 'c2',
  secondThird: 'c1'
};

export const boxLabels = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9'];

export const boxLabelRowSets = [
  ['b1', 'b2', 'b3'],
  ['b4', 'b5', 'b6'],
  ['b7', 'b8', 'b9']
];
export const boxLabelColSets = [
  ['b1', 'b4', 'b7'],
  ['b2', 'b5', 'b8'],
  ['b3', 'b6', 'b9']
];

export const boxSquareIdsByRowsCols: BoxSquareIdsByRowsCols = {
  b1: {
    r1: ['A1', 'A2', 'A3'],
    r2: ['B1', 'B2', 'B3'],
    r3: ['C1', 'C2', 'C3'],
    c1: ['A1', 'B1', 'C1'],
    c2: ['A2', 'B2', 'C2'],
    c3: ['A3', 'B3', 'C3']
  },
  b2: {
    r1: ['A4', 'A5', 'A6'],
    r2: ['B4', 'B5', 'B6'],
    r3: ['C4', 'C5', 'C6'],
    c1: ['A4', 'B4', 'C4'],
    c2: ['A5', 'B5', 'C5'],
    c3: ['A6', 'B6', 'C6']
  },
  b3: {
    r1: ['A7', 'A8', 'A9'],
    r2: ['B7', 'B8', 'B9'],
    r3: ['C7', 'C8', 'C9'],
    c1: ['A7', 'B7', 'C7'],
    c2: ['A8', 'B8', 'C8'],
    c3: ['A9', 'B9', 'C9']
  },
  b4: {
    r1: ['D1', 'D2', 'D3'],
    r2: ['E1', 'E2', 'E3'],
    r3: ['F1', 'F2', 'F3'],
    c1: ['D1', 'E1', 'F1'],
    c2: ['D2', 'E2', 'F2'],
    c3: ['D3', 'E3', 'F3']
  },
  b5: {
    r1: ['D4', 'D5', 'D6'],
    r2: ['E4', 'E5', 'E6'],
    r3: ['F4', 'F5', 'F6'],
    c1: ['D4', 'E4', 'F4'],
    c2: ['D5', 'E5', 'F5'],
    c3: ['D6', 'E6', 'F6']
  },
  b6: {
    r1: ['D7', 'D8', 'D9'],
    r2: ['E7', 'E8', 'E9'],
    r3: ['F7', 'F8', 'F9'],
    c1: ['D7', 'E7', 'F7'],
    c2: ['D8', 'E8', 'F8'],
    c3: ['D9', 'E9', 'F9']
  },
  b7: {
    r1: ['G1', 'G2', 'G3'],
    r2: ['H1', 'H2', 'H3'],
    r3: ['I1', 'I2', 'I3'],
    c1: ['G1', 'H1', 'I1'],
    c2: ['G2', 'H2', 'I2'],
    c3: ['G3', 'H3', 'I3']
  },
  b8: {
    r1: ['G4', 'G5', 'G6'],
    r2: ['H4', 'H5', 'H6'],
    r3: ['I4', 'I5', 'I6'],
    c1: ['G4', 'H4', 'I4'],
    c2: ['G5', 'H5', 'I5'],
    c3: ['G6', 'H6', 'I6']
  },
  b9: {
    r1: ['G7', 'G8', 'G9'],
    r2: ['H7', 'H8', 'H9'],
    r3: ['I7', 'I8', 'I9'],
    c1: ['G7', 'H7', 'I7'],
    c2: ['G8', 'H8', 'I8'],
    c3: ['G9', 'H9', 'I9']
  }
};

export const boxSquareIdsByPosition: BoxSquareIdsByPosition = {
  b1: {
    1: 'A1',
    2: 'A2',
    3: 'A3',
    4: 'B1',
    5: 'B2',
    6: 'B3',
    7: 'C1',
    8: 'C2',
    9: 'C3'
  },
  b2: {
    1: 'A4',
    2: 'A5',
    3: 'A6',
    4: 'B4',
    5: 'B5',
    6: 'B6',
    7: 'C4',
    8: 'C5',
    9: 'C6'
  },
  b3: {
    1: 'A7',
    2: 'A8',
    3: 'A9',
    4: 'B7',
    5: 'B8',
    6: 'B9',
    7: 'C7',
    8: 'C8',
    9: 'C9'
  },
  b4: {
    1: 'D1',
    2: 'D2',
    3: 'D3',
    4: 'E1',
    5: 'E2',
    6: 'E3',
    7: 'F1',
    8: 'F2',
    9: 'F3'
  },
  b5: {
    1: 'D4',
    2: 'D5',
    3: 'D6',
    4: 'E4',
    5: 'E5',
    6: 'E6',
    7: 'F4',
    8: 'F5',
    9: 'F6'
  },
  b6: {
    1: 'D7',
    2: 'D8',
    3: 'D9',
    4: 'E7',
    5: 'E8',
    6: 'E9',
    7: 'F7',
    8: 'F8',
    9: 'F9'
  },
  b7: {
    1: 'G1',
    2: 'G2',
    3: 'G3',
    4: 'H1',
    5: 'H2',
    6: 'H3',
    7: 'I1',
    8: 'I2',
    9: 'I3'
  },
  b8: {
    1: 'G4',
    2: 'G5',
    3: 'G6',
    4: 'H4',
    5: 'H5',
    6: 'H6',
    7: 'I4',
    8: 'I5',
    9: 'I6'
  },
  b9: {
    1: 'G7',
    2: 'G8',
    3: 'G9',
    4: 'H7',
    5: 'H8',
    6: 'H9',
    7: 'I7',
    8: 'I8',
    9: 'I9'
  }
};

/**
 * Array of every valid Sudoku square string:
 * ['1', '2', '3', '4', '5', '6', '7', '8', '9']
 */
export const puzzleVals: PuzzleVal[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export type NeighboringBoxLabels = (boxLabel: string) => string[];

/** neighboringRowBoxes
 *
 * Given a boxLabel, this function returns the neighboring box labels from this row. For example,
 * given 'b1', this function will return ['b2', 'b3']
 *
 * @param boxLabel 'b1' - 'b9'
 * @returns array of 2 box label strings
 */
export const neighboringRowBoxes: NeighboringBoxLabels = (boxLabel) => {
  // Designate other boxes in line with current boxLabel
  // (e.g. for boxLabel 'b1': 2ndBox 'b2', 3rd box 'b3')
  const boxNum = Number(boxLabel[1]) - 1;
  let secondBoxNum = boxNum + 1;
  let thirdBoxNum = boxNum + 2;
  const boxSection = Math.floor(boxNum / 3);
  const secondBoxSection = Math.floor(secondBoxNum / 3);
  const thirdBoxSection = Math.floor(thirdBoxNum / 3);

  if (secondBoxSection > boxSection) secondBoxNum -= 3;
  if (thirdBoxSection > boxSection) thirdBoxNum -= 3;
  secondBoxNum += 1;
  thirdBoxNum += 1;

  const secondBoxLabel = 'b' + secondBoxNum.toString();
  const thirdBoxLabel = 'b' + thirdBoxNum.toString();
  return [secondBoxLabel, thirdBoxLabel];
};

/** neighboringColBoxes
 *
 * Given a boxLabel, this function returns the neighboring box labels from this col. For example,
 * given 'b1', this function will return ['b4', 'b7']
 *
 * @param boxLabel 'b1' - 'b9'
 * @returns array of 2 box label strings
 */
export const neighboringColBoxes = (boxLabel: string) => {
  const secondBoxNum =
    Number(boxLabel[1]) + 3 > 9 ? Number(boxLabel[1]) + 3 - 9 : Number(boxLabel[1]) + 3;
  const thirdBoxNum =
    Number(boxLabel[1]) + 6 > 9 ? Number(boxLabel[1]) + 6 - 9 : Number(boxLabel[1]) + 6;
  const secondBoxLabel = 'b' + secondBoxNum.toString();
  const thirdBoxLabel = 'b' + thirdBoxNum.toString();
  return [secondBoxLabel, thirdBoxLabel];
};
