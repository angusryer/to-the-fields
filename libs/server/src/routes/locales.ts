import Express = require("express");
import fs = require("fs");
import path = require("path");
import { reply } from "../http";
import { routes, HttpCodes } from "shared";

export default class LocaleRoutes {
  constructor(private app: Express.Application) {
    /**
     * Get a specific locale
     * @route GET /locales/{lng}/{ns}
     */
    this.app.get(
      `${routes.locales}/:lng/:ns`,
      async (req: Express.Request, res: Express.Response) => {
        const localeParams = req.params as { lng: string; ns: string };

        if (!localeParams.lng || !localeParams.ns) {
          return reply(res, {
            status: HttpCodes.BadRequest,
            message: "Invalid locale parameters",
          });
        }

        // Construct the file path safely
        const filePath = path.join(
          __dirname,
          "..",
          "locales",
          localeParams.lng,
          `${localeParams.ns}.json`
        );

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
          return reply(res, {
            status: HttpCodes.NotFound,
            message: "Locale file not found",
          });
        }

        try {
          // Dynamically require the file
          const data = require(filePath);
          reply(res, {
            status: HttpCodes.OK,
            message: "Locale successfully fetched",
            data,
          });
        } catch (error) {
          reply(res, {
            status: HttpCodes.InternalServerError,
            message: "Error fetching locale",
          });
        }
      }
    );
  }
}
