import { UserType } from "schema/user";

declare module "express" {
  interface Request {
    user?: Omit<UserType, "password">;
  }
}
