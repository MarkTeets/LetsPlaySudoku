// Types
import { SolutionFunctionDictionary, SolutionStringDictionary } from '../../types';

// Utilities
import { singlePositionSolver } from './singlePositionSolver';
import { singleCandidateSolver } from './singleCandidateSolver';
import { candidateLinesSolver } from './candidateLinesSolver';
import { doublePairsSolver } from './doublePairsSolver';
import { multipleLinesSolver } from './multipleLinesSolver';
import { nakedPairSolver, nakedTripleSolver, nakedQuadSolver } from './nakedSubsetSolver';
import { hiddenPairSolver, hiddenTripleSolver, hiddenQuadSolver } from './hiddenSubsetSolver';
import { xWingSolver } from './xWingSolver';
import { forcingChainsSolver } from './forcingChainsSolver';
import { swordfishSolver } from './swordfishSolver';

export const solutionFunctionDictionary: SolutionFunctionDictionary = {
  singlePosition: singlePositionSolver,
  singleCandidate: singleCandidateSolver,
  candidateLines: candidateLinesSolver,
  doublePairs: doublePairsSolver,
  multipleLines: multipleLinesSolver,
  nakedPair: nakedPairSolver,
  hiddenPair: hiddenPairSolver,
  nakedTriple: nakedTripleSolver,
  hiddenTriple: hiddenTripleSolver,
  xWing: xWingSolver,
  forcingChains: forcingChainsSolver,
  nakedQuad: nakedQuadSolver,
  hiddenQuad: hiddenQuadSolver,
  swordfish: swordfishSolver
};

export const solutionStringDictionary: SolutionStringDictionary = {
  singlePosition: 'Single Position',
  singleCandidate: 'Single Candidate',
  candidateLines: 'Candidate Lines',
  doublePairs: 'Double Pairs',
  multipleLines: 'Multiple Lines',
  nakedPair: 'Naked Pair',
  hiddenPair: 'Hidden Pair',
  nakedTriple: 'Naked Triple',
  hiddenTriple: 'Hidden Triple',
  xWing: 'X-Wing',
  forcingChains: 'Forcing Chains',
  nakedQuad: 'Naked Quad',
  hiddenQuad: 'Hidden Quad',
  swordfish: 'Swordfish'
};
