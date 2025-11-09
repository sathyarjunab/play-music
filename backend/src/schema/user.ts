import { Schema, model, InferSchemaType } from "mongoose";

const user = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

type UserType = InferSchemaType<typeof user>;

const User = model<UserType>("user", user);

export { UserType };
export default User;
