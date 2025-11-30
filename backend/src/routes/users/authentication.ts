import bcrypt from "bcrypt";
import { Router } from "express";
import zod from "zod";
import { getToken } from "../../middleware/auth";
import User from "../../schema/user";

const route = Router();

route.post("/signup", async (req, res) => {
  const reqBody = zod
    .object({
      name: zod.string(),
      email: zod.email(),
      password: zod
        .string()
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@!#$%^&*()_+{}\[\]:;<>,.?~\-]{8,}$/
        ), // password must be at least 8 characters long and contain at least one letter and one number
    })
    .parse(req.body);

  const user = await User.findOne({ email: reqBody.email });
  if (user) return res.status(400).json({ message: "user already exists" });

  bcrypt.hash(reqBody.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    reqBody.password = hash;
    const createdUser = (await User.create(reqBody)).toObject();
    const token = getToken({
      _id: createdUser._id,
      email: createdUser.email,
      name: createdUser.name,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    });
    res.status(201).json({ message: "user created", token });
  });
});

route.post("/login", async (req, res) => {
  try {
    const reqBody = zod
      .object({
        email: zod.email(),
        password: zod.string(),
      })
      .parse(req.body);

    const user = await User.findOne({ email: reqBody.email }).select(
      "+password"
    );

    if (!user) return res.status(401).send({ message: "user not found" });

    bcrypt.compare(reqBody.password, user.password, (err, result) => {
      if (err) return res.status(401).send({ message: err.message });

      if (result) {
        const token = getToken({
          _id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
        return res.status(200).json({ message: "user logged in", token });
      }
    });
  } catch (Err) {
    console.log(Err);
    res.status(500).send({ message: "something went wrong" });
  }
});

export default route;
