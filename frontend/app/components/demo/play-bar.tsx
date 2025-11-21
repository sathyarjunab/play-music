"use client";

import {
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useState } from "react";

export default function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/60 backdrop-blur-2xl border-t border-white/10 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
          🎵
        </div>
        <div>
          <h4 className="text-white font-semibold">Neon Dreams</h4>
          <p className="text-gray-400 text-sm">Synthwave Collective</p>
        </div>
        <button className="text-gray-400 hover:text-pink-500 transition-colors ml-2">
          <Heart size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Shuffle size={20} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <SkipBack size={24} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
          >
            {isPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} fill="black" className="ml-0.5" />
            )}
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <SkipForward size={24} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Repeat size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3 w-full max-w-lg">
          <span className="text-xs text-gray-400">1:23</span>
          <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          </div>
          <span className="text-xs text-gray-400">3:45</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end gap-3">
        <Volume2 size={20} className="text-gray-400" />
        <input
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 accent-purple-500"
        />
      </div>
    </div>
  );
}
