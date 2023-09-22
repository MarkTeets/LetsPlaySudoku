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
  saveUser: RequestHandler;
};

export type PuzzleController = {
  getPuzzleByNumber: RequestHandler;
  getUserPuzzles: RequestHandler;
  getNextPuzzle: RequestHandler;
};

export type CookieController = {
  setSSIDCookie: RequestHandler;
  deleteSSIDCookie: RequestHandler;
};

export type SessionController = {
  startSession: RequestHandler;
  findSession: RequestHandler;
  deleteSession: RequestHandler;
};

export type UserDocument = {
  username: string;
  password: string;
  displayName: string;
  lastPuzzle: number;
  allPuzzles: UserPuzzleObj[];
  _id: Types.ObjectId;
};

export type Session = {
  cookieId: string;
  createdAt: Date;
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
