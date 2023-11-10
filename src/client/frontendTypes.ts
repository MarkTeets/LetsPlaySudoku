import React, { Dispatch, SetStateAction, ReactNode, MutableRefObject, ComponentType } from 'react';

// Types
import { User, PuzzleCollection } from '../types';

//---- Square Types ------------------------------------------------------------------------------
/** SquareId
 *
 * @type - string - Holds every option for a squareId from 'A1' to 'I9', with the letter denoting
 * the row and the number denoting the column. For example. 'A2' is in the first row and in the
 * second column
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

/** PuzzleVal
 *
 * @type PuzzleVal - string - These are all of the valid strings a square could hold in a
 * solved puzzle which are string representations of the numbers '1' to '9'.
 */
export type PuzzleVal = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type SquareIdsByRowsCols = {
  [key: string]: SquareId[];
};

export type BoxSquareIdsByRowsCols = {
  [key: string]: SquareIdsByRowsCols;
};

type SquareIdsByPosition = {
  [key: string]: SquareId;
};

export type BoxSquareIdsByPosition = {
  [key: string]: SquareIdsByPosition;
};

export type BoxSegmentCombinationKey = 'firstSecond' | 'firstThird' | 'secondThird';

export type BoxSegmentCombinationLabels = {
  [key in BoxSegmentCombinationKey]: string[];
};

export type BoxSegmentCombinationExcludedLabel = {
  [key in BoxSegmentCombinationKey]: string;
};

export type PositionCombinations =
  | '12'
  | '13'
  | '23'
  | '45'
  | '46'
  | '56'
  | '78'
  | '79'
  | '89'
  | '14'
  | '17'
  | '47'
  | '25'
  | '28'
  | '58'
  | '36'
  | '39'
  | '69';

/** AllPeers
 *
 * @type AllPeers: object - For any given first square, a peer is another square that can't
 * simultaneously hold the same number as the first square based on the rules of sudoku. This
 * includes any square in the same row, column, or unit box (box of 9 squares) as the first square.
 * allPeers is made and stored once, and then used to find the peers associated with any given
 * squareId.
 *
 * For example, one property of an AllPeers object looks like this:
 * A1: {"A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "B1", "C1", "D1", "E1", "F1", "G1", "H1",
 *  "I1", "B2", "B3", "C2", "C3"}
 */
export type AllPeers = {
  [key: string]: Set<SquareId>;
};

/** FilledSquare
 *
 * @type FilledSquare: object - Holds all info related to an individual sudoku square that has been
 * filled in
 *
 * @property puzzleVal - PuzzleVal string - A string from '1' to '9' representing the value held by
 * a Sudoku square
 *
 * @property duplicate - boolean - This will be true if a square's peers holds the same puzzleVal,
 * and false otherwise. This is used to set styles for squares that hold duplicate values
 *
 * @property fixedVal - boolean - This will be true if the number for a given square was provided by
 * the original puzzle string. It's used to keep a user from changing the value of said square
 *
 * @property numberHighlight - boolean - Used to update the styles such that a number is
 * highlighted. Primarily will be used with solution tips to show users which numbers to consider
 */
export type FilledSquare = {
  puzzleVal: PuzzleVal;
  duplicate: boolean;
  fixedVal: boolean;
  numberHighlight: boolean;
};

/** FilledSquares
 *
 * @type FilledSquares: object - Each square of the Sudoku grid filled in with a value is assigned
 * a property with a key of the squareId of the associated square ('A1' to 'I9') and a value of a
 * FilledSquare object. FilledSquares is scarcely filled for deep copying efficiency.
 *
 * @property size - number - Represents how many FilledSquare objects are currently in the
 * FilledSquares object
 *
 * @property FilledSquare - object representing a square that has a value in the Sudoku grid.
 */
export type FilledSquares = {
  size: number;
} & {
  [key in SquareId]?: FilledSquare;
};

/** PencilData
 *
 * @type PencilData: object - Holds all info related to an individual penciled in number
 *
 * @property duplicate - boolean - true if the number is a duplicate in relation to a filledSquare
 * value
 *
 * @property highlightNumber - boolean - true if number should be highlighted
 */
export type PencilData = {
  duplicate: boolean;
  highlightNumber: boolean;
};

/** PencilSquare
 *
 * @type PencilSquare: object - PencilSquare represents a single Sudoku grid square with penciled in
 * values. For every penciled in number, PencilSquare has a property with a key of the PuzzleVal
 * string ('1' to '9') and a value of a PencilData object for every penciled in number. PencilSquare
 * objects are scarcely filled for more efficient deep copying.
 *
 * @property size - number - Number of PencilData objects in the PencilSquare
 *
 * @property PencilData - object - Holds data related to an individual penciled in number
 */
export type PencilSquare = {
  size: number;
} & {
  [key in PuzzleVal]?: PencilData;
};

/** PencilSquares
 *
 * @type PencilSquares: object - PencilSquares is a collection of PencilSquare objects user to
 * render to the Sudoku grid. Every square holding a penciled in value is represented by a property,
 * with a key of the squareId of the associated square ('A1' to 'I9') and a value of a PencilSquare
 * object. PencilSquares objects are scarcely filled for more efficient deep copying.
 *
 * @property PencilSquare - object - Holds data related to penciled in numbers for a single sudoku
 * square
 */
export type PencilSquares = {
  [key in SquareId]?: PencilSquare;
};

/** InitialSquares
 *
 * @type InitialSquares: object - Object that holds initial state of the puzzle based on the
 * original puzzle string, the user's progress string, and the user's penciled squares string. This
 * is stored via useState in the puzzle page component and used to populate the first render of the
 * grid, as well as to reset the puzzle with the "originalPuzzleFilledSquares" object.
 *
 * @property originalPuzzleFilledSquares - FilledSquares object - A FilledSquares object based
 * solely on the original puzzle string. The "fixedVal" property is set to true for of each
 * FilledSquare object in originalPuzzleFilledSquares
 *
 * @property filledSquares - FilledSquares object - Built from the originalPuzzleFilledSquares and a
 * user's progress string, this FilledSquares object has accurate "fixedVal" and "duplicate"
 * properties and is used on the first render to produce all of the filled in squares in the Sudoku
 * grid
 *
 * @property pencilSquares - PencilSquares object - Built from a user's penciled squares string,
 * this object has accurate "duplicate" properties and is used on the first render to produce of the
 * penciled in numbers in the Sudoku grid
 */
export type InitialSquares = {
  originalPuzzleFilledSquares: FilledSquares;
  filledSquares: FilledSquares;
  pencilSquares: PencilSquares;
};

/** ClickedSquare
 *
 * @type ClickedSquare: SquareId | null - Represents which square the user has clicked on in the
 * puzzle. This is used not only to enter values into the puzzle, but also to change the html
 * classes associated with every Sudoku grid square such that they're styled correctly.
 */
export type ClickedSquare = SquareId | null;

//---- Dispatch Types ----------------------------------------------------------------------------
export type SetUser = Dispatch<SetStateAction<User>>;

type SetInitialSquares = Dispatch<SetStateAction<InitialSquares>>;

export type SetFilledSquares = Dispatch<SetStateAction<FilledSquares>>;

export type SetPencilSquares = Dispatch<SetStateAction<PencilSquares>>;

type SetClickedSquare = Dispatch<SetStateAction<ClickedSquare>>;

type SetPencilMode = Dispatch<SetStateAction<boolean>>;

//---- Context Types ----------------------------------------------------------------------------
/**
 * These are collections of state that will be placed in context so they can be accessed by
 * components via the useContext hook without needing to prop drill through every intermediate
 * component
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

export type PageContextValue = {
  pageInfo: MutableRefObject<string>;
};

export type SquareContextValue = {
  puzzleNumber: number;
  clickedSquare: ClickedSquare;
  setClickedSquare: SetClickedSquare;
  initialSquares: InitialSquares;
  pencilMode: boolean;
  setPencilMode: SetPencilMode;
  filledSquares: FilledSquares;
  setFilledSquares: SetFilledSquares;
  pencilSquares: PencilSquares;
  setPencilSquares: SetPencilSquares;
};

export type GameSettingContextValue = {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  autoSave: boolean;
  setAutoSave: Dispatch<SetStateAction<boolean>>;
  highlightPeers: boolean;
  setHighlightPeers: Dispatch<SetStateAction<boolean>>;
  showDuplicates: boolean;
  setShowDuplicates: Dispatch<SetStateAction<boolean>>;
  trackMistakes: boolean;
  setTrackMistakes: Dispatch<SetStateAction<boolean>>;
  showMistakesOnPuzzlePage: boolean;
  setShowMistakesOnPuzzlePage: Dispatch<SetStateAction<boolean>>;
};

//---- Component Functions -----------------------------------------------------------------------
export type OnSquareClick = (event: React.MouseEvent<HTMLElement>) => void;

export type InitializeSquares = (
  puzzleNumber: number,
  user: User,
  puzzleCollection: PuzzleCollection
) => InitialSquares;

export type ResetStateOnRefresh = (
  puzzleNumber: number,
  user: User,
  puzzleCollection: PuzzleCollection,
  setInitialSquares: SetInitialSquares,
  setFilledSquares: SetFilledSquares,
  setPencilSquares: SetPencilSquares
) => void;

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

export type OnNumberDelete = (
  pencilMode: boolean,
  clickedSquare: ClickedSquare,
  filledSquares: FilledSquares,
  setFilledSquares: SetFilledSquares,
  pencilSquares: PencilSquares,
  setPencilSquares: SetPencilSquares
) => void;

export type OnPuzzleKeyDown = (
  e: React.KeyboardEvent<HTMLElement>,
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

export type AutofillPencilSquares = (
  filledSquares: FilledSquares,
  setPencilSquares: SetPencilSquares
) => void;

export type SignInWithSession = (
  setUser: SetUser,
  setPuzzleCollection: SetPuzzleCollection
) => Promise<boolean>;

//---- Component Props ---------------------------------------------------------------------------
export type SideBarProps = {
  collapseSideBar: () => void;
};

export type SideBarContainerProps = {
  SideBar: ComponentType<SideBarProps>;
};

export type SideBarSectionContainerProps = {
  children: ReactNode;
  title: string;
  defaultExpanded?: boolean;
};

export type SettingsToggleProps = {
  label: string;
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
};

export type PuzzleNumberProp = {
  puzzleNumber?: number;
};

export type SavedPuzzleGraphicProps = {
  progress: string;
};

export type BoxUnitContainerProps = {
  boxUnit: Set<SquareId>;
};

export type SquareContainerProps = {
  squareId: SquareId;
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
