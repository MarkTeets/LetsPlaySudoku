import React, { Dispatch, SetStateAction } from 'react';

// Types
import { User, PuzzleCollection } from '../types';

// Square Types
/**
 * Holds every option for a squareId from 'A1' to 'I9', with the letter denoting the row and the number denoting
 * the column. For example. 'A2' is in the first row and in the second column
 */
// prettier-ignore
export type SquareId =
  'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'A9' |
  'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7' | 'B8' | 'B9' |
  'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9' |
  'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9' |
  'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6' | 'E7' | 'E8' | 'E9' |
  'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' |
  'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'G8' | 'G9' |
  'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'H7' | 'H8' | 'H9' |
  'I1' | 'I2' | 'I3' | 'I4' | 'I5' | 'I6' | 'I7' | 'I8' | 'I9';

/**
 * These are all of the valid strings a square could hold in a solved puzzle which are
 * string representations of the numbers '1' to '9'.
 */
export type PuzzleVal = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

/**
 * An allPeers object uses this type definition. For any given first square, a peer is another
 * square that can't simultaneously hold the same number as the first square based on the rules
 * of sudoku. This includes any square in the same row, column, or unit box (box of 9 squares) as
 * the first square. allPeers objects are used to populate the peers property of each square object
 * in an allSquares object.
 *
 * For example, one property of an AllPeers object looks like this:
 * A1: {"A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1",
 *     "B2", "B3", "C2", "C3"}
 */
export type AllPeers = {
  [key: string]: Set<SquareId>;
};

/** FilledSquare
 *
 * @type FilledSquare: object - Holds all info related to an individual sudoku square that has been filled in
 *
 * @member puzzleVal - string - A string from '1' to '9' correlated with the original puzzle when the puzzle
 * is first loaded, and is subsequently updated by the user during game play. Is also used to capture
 * current progress on a given puzzle when the puzzle is saved.
 *
 * @member duplicate - boolean - This will be true if a square's peers holds the same puzzleVal,
 * and false otherwise. This is used to set styles for squares that hold duplicate values
 *
 * @member fixedVal - boolean - This will be true if the number for a given square was provided by the
 * original puzzle string. It's used to keep a user from changing the value of said square
 *
 * @member numberHighlight - boolean - Used to update the styles such that a number is highlighted. Primarily
 * will be used with solution tips to show users which numbers to consider
 */
export type FilledSquare = {
  puzzleVal: PuzzleVal;
  duplicate: boolean;
  fixedVal: boolean;
  numberHighlight: boolean;
};

export type FilledSquares = {
  size: number;
} & {
  [key in SquareId]?: FilledSquare;
};

export type PencilSquares = {
  [key in SquareId]?: PencilSquare;
};

export type PencilSquare = {
  size: number;
} & {
  [key in PuzzleVal]?: PencilData;
};

export type PencilData = {
  duplicate: boolean;
  highlightNumber: boolean;
};

// Component Types
/** SetUser
 *
 * useState dispatch action used to set the state of a user
 */
export type SetUser = Dispatch<SetStateAction<User>>;

/**
 * @type UserContextValue
 * @member user - a User object to be stored in a component via useState
 * @member setUser - the dispactch function corresponding to the useState User object above
 */
export type UserContextValue = {
  user: User;
  setUser: SetUser;
};

export type SetPuzzleCollection = Dispatch<SetStateAction<PuzzleCollection>>;

export type PuzzleCollectionContextValue = {
  puzzleCollection: PuzzleCollection;
  setPuzzleCollection: SetPuzzleCollection;
};

export type PageInfo = { current: string };

export type PageContextValue = {
  pageInfo: PageInfo;
};

export type ClickedSquare = SquareId | null;

type SetClickedSquare = Dispatch<SetStateAction<ClickedSquare>>;

type SetFilledSquares = Dispatch<SetStateAction<FilledSquares>>;

type SetPencilSquares = Dispatch<SetStateAction<PencilSquares>>;

export type SquareContextValue = {
  clickedSquare: ClickedSquare;
  setClickedSquare: SetClickedSquare;
  filledSquares: FilledSquares;
  pencilSquares: PencilSquares;
};

export type NumberSelectBarProps = {
  pencilMode: boolean;
  clickedSquare: ClickedSquare;
  filledSquares: FilledSquares;
  setFilledSquares: SetFilledSquares;
  pencilSquares: PencilSquares;
  setPencilSquares: SetPencilSquares;
};

export type BoxUnitContainerProps = {
  boxUnit: Set<SquareId>;
};

export type SquareContainerProps = {
  squareId: SquareId;
  squareClasses: string;
};

export type SquareProps = {
  squareId: SquareId;
  squareClasses: string;
  onSquareClick: OnSquareClick;
};

export type PencilSquareProps = {
  squareId: SquareId;
  onSquareClick: OnSquareClick;
};

export type OnSquareClick = (event: React.MouseEvent<HTMLElement>) => void;

export type OnNumberChange = (
  buttonVal: PuzzleVal,
  pencilMode: boolean,
  clickedSquare: ClickedSquare,
  filledSquares: FilledSquares,
  setFilledSquares: SetFilledSquares,
  pencilSquares: PencilSquares,
  setPencilSquares: SetPencilSquares
) => void;

export type OnNumberClick = (
  e: React.MouseEvent<HTMLButtonElement>,
  pencilMode: boolean,
  clickedSquare: ClickedSquare,
  filledSquares: FilledSquares,
  setFilledSquares: SetFilledSquares,
  pencilSquares: PencilSquares,
  setPencilSquares: SetPencilSquares
) => void;

export type MakeButtons = (
  pencilMode: boolean,
  clickedSquare: ClickedSquare,
  filledSquares: FilledSquares,
  setFilledSquares: SetFilledSquares,
  pencilSquares: PencilSquares,
  setPencilSquares: SetPencilSquares
) => React.JSX.Element[];

export type HandleFirstPencilSquaresDuplicates = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares,
  setPencilSquares: SetPencilSquares
) => void;

export type AutofillPencilSquares = (
  filledSquares: FilledSquares,
  setFilledSquares: SetFilledSquares,
  setPencilSquares: SetPencilSquares
) => void;