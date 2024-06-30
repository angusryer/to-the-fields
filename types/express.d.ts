import { UserSchema } from "shared";

/** Augment the Express Request object to include the user object */
declare module "express" {
  interface Request {
    user?: Partial<User>;
  }
}
