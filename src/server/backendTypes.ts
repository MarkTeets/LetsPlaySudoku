// Types
import { RequestHandler } from 'express';
import { UserPuzzleObj } from '../types';
import { Types } from 'mongoose';

export type UserController = {
  getUser: RequestHandler;
  cleanUser: RequestHandler;
  createUser: RequestHandler;
  verifyUser: RequestHandler;
  savePuzzle: RequestHandler;
};

export type PuzzleController = {
  getPuzzleByNumber: RequestHandler;
  getUserPuzzles: RequestHandler;
  getNextPuzzle: RequestHandler;
};

export type CookieController = {
  setSSIDCookie: RequestHandler;
};

export type SessionController = {
  startSession: RequestHandler;
  isLoggedIn: RequestHandler;
  logOut: RequestHandler;
};

export type UserDocument = {
  username: string;
  password: string;
  displayName: string;
  lastPuzzle: number;
  allPuzzles: UserPuzzleObj[];
  _id: Types.ObjectId;
};

export type CustomErrorInput = {
  method: string;
  overview: string;
  status?: number;
  err: string | Error | unknown;
};

export type CustomErrorOutput = {
  log: string;
  message: {
    err: string;
  };
  status?: number;
};

export type CustomErrorGenerator = (customErrorInput: CustomErrorInput) => CustomErrorOutput;

export type BackendStatus = 'validStatus';
