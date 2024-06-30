import { NextFunction, Request, Response } from "express";
import { IReply } from "shared";

export function reply<T = any>(res: Response<IReply<T>>, params: IReply<T>): void {
  if (!params.message) {
    throw new Error("No message provided in response from server");
  }
  res.status(params.status).json(params);
  return;
}

export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

// Middleware handler that accepts an array of middleware functions to run
export function mw(middleware: MiddlewareFunction[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    middleware
      .reduce((promise, mw) => promise.then(() => mw(req, res, next)), Promise.resolve())
      .then(() => next())
      .catch(next);
  };
}
