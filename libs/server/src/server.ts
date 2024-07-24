// load the environment variables before anything else
import { configDotenv } from "dotenv";
configDotenv();

import Express = require("express");
import Db from "./db";
import AuthRoutes from "./routes/auth";
import AppRoutes from "./routes/app";
import CheckRoutes from "./routes/check";
import LocaleRoutes from "./routes/locales";

export default class Server {
  public listen: Express.Application["listen"];
  private app: Express.Application;
  private port: number = 3000;
  private db: Db;

  constructor() {
    this.app = Express();
    this.app.use(Express.json());
    this.app.use(Express.urlencoded({ extended: true }));
    const db = new Db();
    this.db = db;
    this.listen = this.init(this.app, this.db);
  }

  private init(app: Express.Application, db: Db): Express.Application["listen"] {
    // setup the routes
    console.log("Initializing API routes...");
    new CheckRoutes(app);
    new LocaleRoutes(app);
    new AuthRoutes(db, app);
    new AppRoutes(db, app);

    return () =>
      app.listen(this.port, () => {
        console.log(`Server started successfully on port ${this.port}`);
      });
  }
}
