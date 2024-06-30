// Standard HTTP responses
export enum HttpCodes {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

// Standard response status and messages
export interface IReply<T = any> {
  status: HttpCodes | number;
  message: string;
  data?: T;
}
