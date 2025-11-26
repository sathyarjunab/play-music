"use client";
import api from "@/app/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Unlock } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const roomSchema = z
  .object({
    roomName: z
      .string()
      .min(1, "Room name is required")
      .min(3, "Room name must be at least 3 characters"),
    isPrivate: z.boolean().default(false),
    password: z.string().optional(),
    hasLimit: z.boolean().default(false),
    limitPerUser: z.number().optional(),
    generateQR: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.isPrivate && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required for private rooms",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.hasLimit && (!data.limitPerUser || data.limitPerUser < 1)) {
        return false;
      }
      return true;
    },
    {
      message: "Limit per user must be given and greater than 0",
      path: ["limitPerUser"],
    }
  );

export default function CreateRoom() {
  const [roomCreated, setRoomCreated] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [members, setMembers] = useState<{ _id: string; members: string[] }>();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomName: "",
      isPrivate: false,
      password: "",
      hasLimit: false,
      generateQR: false,
    },
  });

  useEffect(() => {
    fetchRoom();
  }, [roomCreated]);

  const isPrivate = watch("isPrivate");
  const hasLimit = watch("hasLimit");

  const onSubmit = async (data: z.infer<typeof roomSchema>) => {
    const payload = {
      roomName: data.roomName,
      isPrivate: data.isPrivate,
      password: data.isPrivate ? data.password : null,
      hasLimit: data.hasLimit,
      limitPerUser: data.hasLimit ? data.limitPerUser : null,
      generateQR: data.generateQR,
    };

    const result = await api.post("/users/create_room", payload, {
      withCredentials: true,
    });
    setRoomCreated(true);
  };

  const handleCreateAnother = () => {
    setRoomCreated(false);
    reset();
  };

  async function fetchRoom() {
    const result = await api.get("/users/list_room", { withCredentials: true });
    console.log(result.data);
    setRooms(result.data.rooms);
  }

  return (
    <div className="flex w-full p-5 justify-around text-white gap-4">
      {/* Create room div */}
      <div
        className={`flex flex-col gap-4 transition-all duration-500 ${
          roomCreated ? "w-1/3" : "w-1/2"
        } mx-5`}
      >
        <h1 className="text-2xl font-bold">CREATE ROOM</h1>
        <div className="border-2 border-amber-500 rounded-lg p-6 bg-black/40">
          {!roomCreated ? (
            <div className="flex flex-col gap-4">
              {/* Room Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Room Name</label>
                <Controller
                  name="roomName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter room name"
                      className={`bg-gray-800 border rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                        errors.roomName
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-600 focus:border-amber-500"
                      }`}
                    />
                  )}
                />
                {errors.roomName && (
                  <span className="text-red-400 text-xs">
                    {errors.roomName.message}
                  </span>
                )}
              </div>

              {/* Private/Public Toggle */}
              <div className="flex items-center gap-3">
                <Controller
                  name="isPrivate"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      id="private"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className="w-4 h-4 cursor-pointer accent-amber-500"
                    />
                  )}
                />
                <label
                  htmlFor="private"
                  className="text-sm font-semibold cursor-pointer"
                >
                  Private Room
                </label>
              </div>

              {/* Password Input */}
              {isPrivate && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Password</label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        placeholder="Enter room password"
                        className={`bg-gray-800 border rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                          errors.password
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-600 focus:border-amber-500"
                        }`}
                      />
                    )}
                  />
                  {errors.password && (
                    <span className="text-red-400 text-xs">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              )}

              {/* Limit Per User Toggle */}
              <div className="flex items-center gap-3">
                <Controller
                  name="hasLimit"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      id="hasLimit"
                      checked={field.value}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(e.target.checked)}
                      name={field.name}
                      ref={field.ref}
                      className="w-4 h-4 cursor-pointer accent-amber-500"
                    />
                  )}
                />
                <label
                  htmlFor="hasLimit"
                  className="text-sm font-semibold cursor-pointer"
                >
                  Enable Song Limit Per User
                </label>
              </div>

              {/* Limit Per User Input */}
              {hasLimit && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">
                    Limit Per User
                  </label>
                  <Controller
                    name="limitPerUser"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        placeholder="e.g., 5"
                        min="1"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className={`bg-gray-800 border rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                          errors.limitPerUser
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-600 focus:border-amber-500"
                        }`}
                      />
                    )}
                  />
                  {errors.limitPerUser && (
                    <span className="text-red-400 text-xs">
                      {errors.limitPerUser.message}
                    </span>
                  )}
                </div>
              )}

              {/* Generate QR Code Toggle */}
              <div className="flex items-center gap-3">
                <Controller
                  name="generateQR"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      id="generateQR"
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      checked={field.value}
                      className="w-4 h-4 cursor-pointer accent-amber-500"
                    />
                  )}
                />
                <label
                  htmlFor="generateQR"
                  className="text-sm font-semibold cursor-pointer"
                >
                  Generate QR Code
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit(onSubmit)}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded transition-colors duration-200 mt-4"
              >
                Create Room
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-green-400 font-semibold mb-4">
                ✓ Room Created Successfully!
              </p>
              <button
                onClick={handleCreateAnother}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded transition-colors duration-200"
              >
                Create Another Room
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Room Details Div */}
      <div
        className={`flex flex-col gap-4 transition-all duration-500 overflow-hidden w-1/3 opacity-100 translate-x-0 mx-5`}
      >
        <h1 className="text-2xl font-bold">ROOM</h1>
        <div className="border-2 border-amber-500 rounded-lg p-6 bg-black/40 h-96 flex flex-col overflow-y-auto space-y-2">
          {rooms.map((r) => {
            const active = selectedRoom === r._id;

            return (
              <div
                key={r._id}
                onClick={() => {
                  setSelectedRoom((prev) => (prev === r._id ? "" : r._id));
                  setMembers((prev) => {
                    return prev && prev._id == r._id
                      ? undefined
                      : {
                          _id: r._id,
                          members: r.members,
                        };
                  });
                }}
                className={
                  "w-full rounded-md cursor-pointer px-4 py-3 border flex items-center justify-between transition-all " +
                  (active
                    ? "border-amber-500 bg-amber-500/20"
                    : "border-gray-700 bg-black/30 hover:bg-gray-700/40 hover:border-gray-500")
                }
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">{r.name}</span>
                  <span className="text-sm text-gray-400">
                    Room ID: {r.owner}
                  </span>
                </div>

                <div>{r.isPrivate ? <Lock /> : <Unlock />}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Friends list div */}
      <div
        className={`flex flex-col gap-4 transition-all duration-500 overflow-hidden ${
          selectedRoom.length > 0
            ? "w-1/3 opacity-100 translate-x-0"
            : "w-0 opacity-0 translate-x-10"
        } mx-5`}
      >
        <h1 className="text-2xl font-bold">MEMBERS</h1>
        <div className="border-2 border-amber-500 rounded-lg p-6 bg-black/40 h-96 flex items-center justify-center">
          {members?.members.map((m) => (
            <div key={m}>as</div>
          ))}
        </div>
      </div>
    </div>
  );
}
