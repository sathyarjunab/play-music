import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import Room from "schema/room";
import User from "schema/user";
import Zod from "zod";
import { ca, id } from "zod/v4/locales";

const route = Router();

//friend req system

route.get("/get_profile", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) return res.status(404).send({ message: "user not found" });

    res.status(200).send({ user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "something went wrong" });
  }
});

route.post("/send_req", async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email } = Zod.object({ email: Zod.string().email() }).parse(
      req.body
    );
    const user = await User.findById(req.user?._id).session(session);
    if (!user) throw new Error("User not found");

    const toSend = await User.findOne({ email }).session(session);
    if (!toSend) throw new Error("Target user not found");

    const eq = (a: any, b: any) =>
      a && b && a.equals ? a.equals(b) : String(a) === String(b);

    if (user.friends.some((id) => eq(id, toSend._id)))
      throw new Error("Already friends");

    if (user.requestsSent.some((id) => eq(id, toSend._id)))
      throw new Error("Request already sent");

    if (user.requestsReceived.some((id) => eq(id, toSend._id))) {
      user.requestsReceived = user.requestsReceived.filter(
        (id) => !eq(id, toSend._id)
      );
      toSend.requestsSent = toSend.requestsSent.filter(
        (id) => !eq(id, user._id)
      );

      if (!user.friends.some((id) => eq(id, toSend._id)))
        user.friends.push(toSend._id);
      if (!toSend.friends.some((id) => eq(id, user._id)))
        toSend.friends.push(user._id);

      await user.save({ session });
      await toSend.save({ session });
      await session.commitTransaction();
      return res.status(200).send({ message: "Friendship established" });
    }

    user.requestsSent.push(toSend._id);
    toSend.requestsReceived.push(user._id);

    await user.save({ session });
    await toSend.save({ session });

    await session.commitTransaction();
    return res.status(201).send({ message: "Request sent" });
  } catch (err: any) {
    await session.abortTransaction();
    return res.status(400).send({ message: err.message });
  } finally {
    session.endSession();
  }
});

route.post("/accept_req", async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = Zod.object({ id: Zod.string() }).parse(req.body);

    const user = await User.findById(req.user?._id).session(session);
    if (!user) throw new Error("User not found");

    const toAccept = await User.findById(id).session(session);
    if (!toAccept) throw new Error("Target user not found");

    if (user._id.equals(toAccept._id))
      throw new Error("Cannot accept yourself");

    const recv = user.requestsReceived.some((x) => x.equals(toAccept._id));
    const sent = toAccept.requestsSent.some((x) => x.equals(user._id));
    if (!recv || !sent) throw new Error("Request not found");

    const alreadyFriends =
      user.friends.some((x) => x.equals(toAccept._id)) ||
      toAccept.friends.some((x) => x.equals(user._id));
    if (alreadyFriends) throw new Error("Already friends");

    user.friends.push(toAccept._id);
    toAccept.friends.push(user._id);

    user.requestsReceived = user.requestsReceived.filter(
      (x) => !x.equals(toAccept._id)
    );
    toAccept.requestsSent = toAccept.requestsSent.filter(
      (x) => !x.equals(user._id)
    );

    user.accepted.push(toAccept._id);

    await user.save({ session });
    await toAccept.save({ session });

    await session.commitTransaction();
    return res.status(200).send({ message: "Friendship established" });
  } catch (err: any) {
    await session.abortTransaction();
    return res.status(400).send({ message: err.message });
  } finally {
    session.endSession();
  }
});

route.post("/reject_req", async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = Zod.object({ id: Zod.string() }).parse(req.body);

    const user = await User.findById(req.user?._id).session(session);
    if (!user) throw new Error("User not found");

    const toReject = await User.findById(id).session(session);
    if (!toReject) throw new Error("Target user not found");

    const recv = user.requestsReceived.some((x) => x.equals(toReject._id));
    const sent = toReject.requestsSent.some((x) => x.equals(user._id));
    if (!recv && !sent) throw new Error("Request not found");

    user.requestsReceived = user.requestsReceived.filter(
      (x) => !x.equals(toReject._id)
    );
    toReject.requestsSent = toReject.requestsSent.filter(
      (x) => !x.equals(user._id)
    );

    await user.save({ session });
    await toReject.save({ session });

    await session.commitTransaction();
    return res.status(200).send({ message: "Request rejected" });
  } catch (err: any) {
    await session.abortTransaction();
    return res.status(400).send({ message: err.message });
  } finally {
    session.endSession();
  }
});

route.post("/create_room", async (req: Request, res: Response) => {
  try {
    const { name } = Zod.object({ name: Zod.string() }).parse(req.body);
    await Room.create({ name, user: [req.user?._id], owner: req.user?._id });
    return res.status(200).send({ message: "Room created" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "something went wrong " });
  }
});

route.post("/join_room", async (req: Request, res: Response) => {
  const { roomId, userId } = Zod.object({
    roomId: Zod.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
    userId: Zod.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
  }).parse(req.body);

  try {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Room not found");

    if (!room.owner.equals(req.user?._id)) {
      return res
        .status(400)
        .send({ message: "your are not the owner of this room" });
    }

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (!room.members.some((id) => id.equals(user._id))) {
      room.members.push(user._id);
      await room.save();
    }

    return res.status(200).send({ message: "Room joined" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "something went wrong " });
  }
});

route.post("/remove_user", async (req, res) => {
  try {
    const { userId, roomId } = Zod.object({
      roomId: Zod.string().refine((Val) =>
        mongoose.Types.ObjectId.isValid(Val)
      ),
      userId: Zod.string().refine((Val) =>
        mongoose.Types.ObjectId.isValid(Val)
      ),
    }).parse(req.body);

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ message: "user not found" });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).send({ message: "room not found" });

    const index = room.members.findIndex((val) => val.equals(user._id));
    if (index === -1)
      return res
        .status(404)
        .send({ message: "user is not present inside the room" });

    room.members.splice(index, 1);

    room.save();
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "something went wrong" });
  }
});

export default route;
