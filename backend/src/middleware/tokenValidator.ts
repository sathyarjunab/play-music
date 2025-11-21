import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserType } from "../schema/user";

const tokenValidator = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "unauthorized" });

  const user = jwt.verify(token, process.env.JWT_SECRET!) as Omit<
    UserType,
    "password"
  >;

  req.user = user;
  next();
};

export default tokenValidator;
