"use client";

import api from "@/app/lib/axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";
import AppContext from "@/app/AuthContext";

export default function Friends() {
  const [search, setSearch] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AppContext);

  async function fetchUser() {
    const res = await api.get("/users/search_users", {
      withCredentials: true,
      params: {
        search,
      },
    });
    setUsers(res.data.users);
    setLoading(false);
  }

  useEffect(() => {
    async function fetcher() {
      if (search.length == 0) {
        setUsers([]);
        return;
      }
      setLoading(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      const timeout = setTimeout(async () => {
        await fetchUser();
      }, 1000);
      timerRef.current = timeout;
    }
    fetcher();
  }, [search]);

  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col w-1/3 h-10/12 m-2 gap-2">
        <div className="border-2 border-amber-500 flex-3 rounded-2xl flex flex-col">
          <input
            className="border border-amber-500 rounded-2xl text-white m-4  h-10 p-3"
            placeholder="Search based on Name,Email"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          {loading ? (
            <div className="h-full w-full flex justify-center items-center">
              <Loader className="animate-spin" />
            </div>
          ) : users.length == 0 && search.length > 0 ? (
            <p className="text-white flex justify-center items-center">
              No users found
            </p>
          ) : (
            users.map((user) => {
              return (
                <div
                  className="border-2 border-amber-500 rounded-2xl m-2 p-2 bg-gray-700/40 text-white"
                  key={user.id}
                  onClick={() => {}}
                >
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </div>
              );
            })
          )}
        </div>
        <div className="border-2 border-amber-500 flex-2 rounded-2xl">
          {user?.requestsReceived.map((user) => {
            return (
              <div
                className="border-2 border-amber-500 rounded-2xl m-2 p-2 bg-gray-700/40 text-white"
                key={user}
                onClick={() => {}}
              >
                <p>{user}</p>
                {/* <p>{user.email}</p> */}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid w-2/3 h-10/12 m-2 grid-cols-2 grid-rows-2 gap-2">
        <div className="border-2 border-amber-500 rounded-2xl"></div>
        <div className="border-2 border-amber-500 rounded-2xl"></div>
        <div className="border-2 border-amber-500 rounded-2xl"></div>
        <div className="border-2 border-amber-500 rounded-2xl"></div>
      </div>
    </div>
  );
}
