import Express = require("express");
import Db from "../db";
import { mw, reply } from "../http";
import { routes, HttpCodes, Leagues, LeagueSchema, Users, UserSchema, User } from "shared";
import Auth from "../auth";

export default class SystemRoutes {
  constructor(private db: Db, private app: Express.Application) {
    /**
     * Get all leagues
     * @route GET /leagues
     */
    this.app.get(
      routes.app.leagues,
      mw([
        async (_req: Express.Request, res: Express.Response) => {
          const result = await this.db.client.from<Leagues, LeagueSchema>("leagues").select("*");
          if (result.error) {
            console.error(result.error);
            reply(res, {
              status: HttpCodes.InternalServerError,
              message: "Failed to fetch leagues",
            });
          } else {
            console.log(result.data);
            reply<LeagueSchema["Row"][] | null>(res, {
              status: HttpCodes.OK,
              message: "Leagues successfully fetched",
              data: result.data,
            });
          }
        },
      ])
    );

    this.app.get(
      routes.app.users,
      mw([
        Auth.verifyToken, // Verify the token
        async (_req: Express.Request, res: Express.Response) => {
          const result = await this.db.client.from<Users, UserSchema>("users").select("*");
          if (result.error) {
            console.error(result.error);
            return reply(res, {
              status: HttpCodes.InternalServerError,
              message: "Failed to fetch leagues",
            });
          } else {
            console.log(result.data);
            reply<User[] | null>(res, {
              status: HttpCodes.OK,
              message: "User successfully fetched",
              data: result.data,
            });
          }
        },
      ])
    );
  }
}
