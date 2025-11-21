import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import Express, { ErrorRequestHandler } from "express";
import tokenValidator from "middleware/tokenValidator";
import { MongooseError } from "mongoose";
import { ZodError } from "zod";
import { MongoDbLibrary } from "./data-base";
import auth from "./routes/users/authentication";
import songFetch from "./routes/users/songs";
import user from "./routes/users/user";

const app = Express();
dotenv.config();

//env
const port = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", auth);

// after this middleware all of the routes will be protected
app.use(tokenValidator);

app.use("/songs", songFetch);
app.use("/users", user);

app.use(((error, req, res, next) => {
  console.log(error);
  if (error instanceof ZodError) {
    return res.status(400).json({ message: error.message });
  }
  if (error instanceof MongooseError) {
    return res.status(400).json({ message: error.message });
  }
  if (error instanceof Error) {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: "something went wrong" });
}) as ErrorRequestHandler);

const db = new MongoDbLibrary();
app.listen(port, () => {
  const mongoose = new MongoDbLibrary();
  mongoose.makeConnection();
  console.log("Server started on port 3000");
});
