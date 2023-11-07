// Utilities
import { pencilStringSolutionExecuter } from '../puzzle-solution-functions/pencilStringSolutionExecuter';
import { hiddenQuadSolver } from '../puzzle-solution-functions/hiddenSubsetSolver';

const hiddenQuadPencilStringExample1 =
  'A1568A356A628A845A9245C258C628C757C835C92357D657D957E1589E21458E345E412E5259E6567E7457E83456E93457F159F214F416F559F946G656G856H235H436H745H9456I156I2345I3456I423I525';
const hiddenQuadPencilStringResult1 =
  'A1568A356A628A845A9245C258C628C757C835C92357D657D957E189E218E345E412E529E6567E7457E83456E93457F159F214F416F559F946G656G856H235H436H745H9456I156I2345I3456I423I525';

describe('Hidden quad solver solves test cases', () => {
  it('should remove extra penciled in values from row example 1', () => {
    expect(pencilStringSolutionExecuter(hiddenQuadSolver, hiddenQuadPencilStringExample1)).toBe(
      hiddenQuadPencilStringResult1
    );
  });
});
