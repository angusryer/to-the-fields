import Express = require("express");
import { HttpCodes, routes } from "shared";
import { reply } from "../http";

export default class HealthCheckRoutes {
  constructor(private app: Express.Application) {
    this.app.get(routes.health.check, (_req, res) => {
      return reply(res, {
        status: HttpCodes.OK,
        message: "Server is healthy",
        data: { uptime: process.uptime() },
      });
    });
  }
}
