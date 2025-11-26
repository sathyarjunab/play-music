import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserType } from "../schema/user";

const tokenValidator = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).send({ message: "unauthorized" });

    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

    const user = jwt.verify(token, process.env.JWT_SECRET!) as Omit<
      UserType,
      "password"
    >;

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "something went wrong", err });
  }
};

export default tokenValidator;
