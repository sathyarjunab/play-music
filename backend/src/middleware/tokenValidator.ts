import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { UserType } from "../schema/user";

const toeknValidator = (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "token not found" });

  const user = jwt.verify(token, process.env.JWT_SECRET!) as Omit<
    UserType,
    "password"
  >;

  req.user = user;
};

export default toeknValidator;
