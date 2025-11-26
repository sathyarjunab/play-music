"use client";

import { Home, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Sidebar Navigation Component
export function Sidebar() {
  const [activeTab, setActiveTab] = useState("home");
  const navItems = [
    { id: "Home", icon: Home, label: "Home", link: "/home" },
    {
      id: "Create_room",
      icon: Plus,
      label: "Create room",
      link: "/createRoom",
    },
    {
      id: "make_friends",
      icon: User,
      label: "Friends",
      link: "/friends",
    },
  ];

  const router = useRouter();

  return (
    <div className="w-64 h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
      <div className="mb-12">
        <h1 className="text-3xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          VibeSync
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              router.push(item.link);
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? "bg-linear-to-r from-purple-500/20 to-pink-500/20 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="mt-auto flex items-center gap-3 px-4 py-3 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all">
        <Plus size={20} />
        Create Playlist
      </button>
    </div>
  );
}
