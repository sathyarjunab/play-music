"use client";
import PlayerBar from "@/app/components/demo/play-bar";
import { Sidebar } from "@/app/components/demo/side-bar";
import { useState } from "react";

// Main Layout Component
export default function MusicPlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {children}
      <PlayerBar />
    </div>
  );
}
