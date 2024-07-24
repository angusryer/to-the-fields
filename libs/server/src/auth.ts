import Jwt = require("jsonwebtoken");
import { NextFunction, Request, Response } from "express";
import { HttpCodes, TRole, User } from "shared";
import { reply } from "./http";

class Auth {
  private _jwtSecret: string | undefined = undefined;

  constructor() {
    this._jwtSecret = process.env.SUPABASE_JWT_SECRET;
  }

  private get jwtSecret() {
    if (!this._jwtSecret) {
      throw new Error("No SUPABASE_JWT_SECRET found");
    }
    return this._jwtSecret;
  }

  public verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return reply(res, { status: HttpCodes.Unauthorized, message: "No token provided" });
    }

    try {
      const decodeJwt = Jwt.verify(token, this.jwtSecret);
      if (!decodeJwt || typeof decodeJwt !== "object" || !decodeJwt.sub || !decodeJwt.email) {
        return reply(res, { status: HttpCodes.Unauthorized, message: "Invalid token" });
      }

      // Extract only the fields we may need for API processing
      const user: Pick<User, "id" | "email" | "roles"> = {
        id: decodeJwt.sub,
        email: decodeJwt.email,
        roles: decodeJwt?.roles ?? [],
      };

      req.user = user;
      next();
    } catch (err: any) {
      return reply(res, { status: HttpCodes.Unauthorized, message: "Invalid token" });
    }
  }

  public decodeToken(token: string, jwtSecret: string | undefined) {
    if (!jwtSecret) {
      throw new Error("No SUPABASE_JWT_SECRET found");
    }
    return Jwt.decode(token, { complete: true });
  }

  public generateToken(payload: any, jwtSecret: string | undefined) {
    if (!jwtSecret) {
      throw new Error("No SUPABASE_JWT_SECRET found");
    }
    return Jwt.sign(payload, jwtSecret);
  }

  public requireRole(role: TRole) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user?.roles?.includes(role)) {
        return reply(res, { status: HttpCodes.Forbidden, message: "Insufficient permissions" });
      }
      next();
    };
  }
}

export default new Auth();
