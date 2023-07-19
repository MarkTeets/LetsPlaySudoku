import { RequestHandler } from 'express';

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

export type CustomErrorInput = {
  method: string;
  overview: string;
  status?: number;
  err: string | Error;
};

export type CustomErrorOutput = {
  log: string;
  message: {
    err: string;
  };
  status?: number;
};

export type CustomErrorGenerator = (customErrorInput: CustomErrorInput) => CustomErrorOutput;
