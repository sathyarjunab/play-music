import mongoose, { InferSchemaType, Schema } from "mongoose";

const room = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: [],
    },
  ],
  songStack: [{ type: Schema.Types.String, required: true }],
});

type RoomType = InferSchemaType<typeof room> & { _id: mongoose.Types.ObjectId };

const Room = mongoose.model<RoomType>("room", room);

export { RoomType };
export default Room;
