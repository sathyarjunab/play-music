"use client";

import { Heart, Play } from "lucide-react";
import { useState } from "react";

// Song Card Component
export function SongCard({
  title,
  artist,
  image,
}: {
  title: string;
  artist: string;
  image: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer group border border-white/5"
    >
      <div className="relative mb-4">
        <div
          className={`aspect-square rounded-xl bg-gradient-to-br ${image} overflow-hidden`}
        >
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🎵
          </div>
        </div>
        {isHovered && (
          <button className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full shadow-lg transform translate-y-0 group-hover:scale-110 transition-transform">
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </button>
        )}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart
            size={16}
            className={isLiked ? "fill-pink-500 text-pink-500" : "text-white"}
          />
        </button>
      </div>
      <h3 className="text-white font-semibold mb-1 truncate">{title}</h3>
      <p className="text-gray-400 text-sm truncate">{artist}</p>
    </div>
  );
}
