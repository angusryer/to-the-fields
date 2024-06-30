import Express = require("express");
import Db from "../db";
import { reply } from "../http";
import { HttpCodes, UserSchema, Users, routes } from "shared";

export default class AuthRoutes {
  constructor(private db: Db, private app: Express.Application) {
    /**
     * Register a new user. This should create a new user in our authentication provider with
     * the email and role provided.
     */
    this.app.post(routes.auth.register, async (req, res) => {
      // const authResult = await this.db.client.auth.admin.createUser({});
      // const dbResult = await this.db.client.from<Users, UserSchema>("users").insert({
      //   id: req?.body?.id,
      //   email: req?.body.email,
      //   name: req?.body?.name ?? "Anonymous",
      //   roles: ["account_owner"],
      // });
      return reply(res, {
        status: HttpCodes.OK, //dbResult.status ?? HttpCodes.OK,
        message: "Sign up successful", //dbResult.statusText ??
        data: { test: "testing" }, // dbResult.data,
      });
    });

    /**
     * Login a user
     */
    this.app.post(routes.auth.login, async (req, res) => {
      // const authResult = await this.db.client.auth.
      const dbResult = await this.db.client
        .from<Users, UserSchema>("users")
        .select("*")
        .eq("email", req?.body.email);
      return reply(res, {
        status: dbResult.status ?? HttpCodes.OK,
        message: dbResult.statusText ?? "Login successful",
        data: dbResult.data,
      });
    });
  }
}
