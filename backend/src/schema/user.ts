import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const user = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    requestsSent: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    requestsReceived: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    accepted: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    rejected: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

type UserType = InferSchemaType<typeof user> & { _id: mongoose.Types.ObjectId };

const User = model<UserType>("user", user);

export { UserType };
export default User;
