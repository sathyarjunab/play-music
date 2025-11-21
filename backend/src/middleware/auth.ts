import mongoose from "mongoose";
import { UserType } from "../schema/user";
import jwt from "jsonwebtoken";

const getToken = (
  user: Omit<
    UserType,
    | "password"
    | "friends"
    | "requestsSent"
    | "requestsReceived"
    | "accepted"
    | "rejected"
  >
): String => {
  const jwtToken = jwt.sign(user, process.env.JWT_SECRET!);
  return jwtToken;
};

export { getToken };
