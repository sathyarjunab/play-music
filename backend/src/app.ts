import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import Express, { ErrorRequestHandler } from "express";
import { MongoDbLibrary } from "./data-base";
import auth from "./routes/user/authentication";
import { ZodError } from "zod";
import { MongooseError } from "mongoose";
const app = Express();
dotenv.config();

//env
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", auth);

app.use(((error, req, res, next) => {
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
