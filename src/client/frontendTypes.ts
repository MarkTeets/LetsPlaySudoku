import React, { MutableRefObject, ChangeEvent, Dispatch, SetStateAction } from 'react';

// Types
import { SquareId, PuzzleVal, FilledSquares, PencilSquares, PuzzleVal2 } from '../types';

export type OnInputChange = (id: SquareId, newVal: PuzzleVal) => void;

export type HandleValueChange = (e: ChangeEvent<HTMLInputElement>) => void;

export type ClickedSquare = SquareId | null;

export type NumberSelectBarProps = {
  pencilMode: boolean;
  clickedSquare: ClickedSquare;
  filledSquares: FilledSquares;
  setFilledSquares: Dispatch<SetStateAction<FilledSquares>>;
  pencilSquares: PencilSquares;
  setPencilSquares: Dispatch<SetStateAction<PencilSquares>>;
};

export type OnNumberChange = (
  buttonVal: PuzzleVal2,
  pencilMode: boolean,
  clickedSquare: ClickedSquare,
  filledSquares: FilledSquares,
  setFilledSquares: Dispatch<SetStateAction<FilledSquares>>,
  pencilSquares: PencilSquares,
  setPencilSquares: Dispatch<SetStateAction<PencilSquares>>
) => void;

export type OnNumberClick = (
  e: React.MouseEvent<HTMLButtonElement>,
  pencilMode: boolean,
  clickedSquare: ClickedSquare,
  filledSquares: FilledSquares,
  setFilledSquares: Dispatch<SetStateAction<FilledSquares>>,
  pencilSquares: PencilSquares,
  setPencilSquares: Dispatch<SetStateAction<PencilSquares>>
) => void;

export type MakeButtons = (
  pencilMode: boolean,
  clickedSquare: ClickedSquare,
  filledSquares: FilledSquares,
  setFilledSquares: Dispatch<SetStateAction<FilledSquares>>,
  pencilSquares: PencilSquares,
  setPencilSquares: Dispatch<SetStateAction<PencilSquares>>
) => React.JSX.Element[];

export type HandleFirstPencilSquaresDuplicates = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares,
  setPencilSquares: Dispatch<SetStateAction<PencilSquares>>
) => void;

export type BoxUnitContainerProps = {
  boxUnit: Set<SquareId>;
};

export type SquareContainerProps = {
  squareId: SquareId;
  squareClassByLocation: string;
};

export type SquareIdProp = {
  squareId: SquareId;
};

export type PageInfo = { current: string };

export type PageContextValue = {
  pageInfo: PageInfo;
};

export type SquareContextValue = {
  setClickedSquare: Dispatch<SetStateAction<ClickedSquare>>;
  filledSquares: FilledSquares;
  pencilSquares: PencilSquares;
};

export type OnSquareClick = (event: React.MouseEvent<HTMLElement>) => void;

export type SquareProps = {
  squareId: SquareId;
  squareClassByLocation: string;
  onSquareClick: OnSquareClick;
};

export type PencilSquareProps = {
  squareId: SquareId;
  onSquareClick: OnSquareClick;
};
