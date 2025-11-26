"use client";

import api from "@/app/lib/axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { store } from "@/app/store";

export default function SearchComponent() {
  const [SearchText, setSearchText] = useState<string>("");
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout>();
  const [searchResult, setSearchResult] = useState<any>();

  useEffect(() => {
    async function bouncer() {
      if (timerRef) clearInterval(timerRef);
      if (SearchText.length === 0) {
        setSearchResult([]);
        return;
      }
      setTimerRef(
        setTimeout(async () => {
          const { data } = await api.get("/songs/search_songs", {
            params: {
              songTitle: SearchText,
            },
          });
          setSearchText((prev) => {
            if (prev.length === 0) return "";
            setSearchResult(data);
            return prev;
          });
        }, 100)
      );
    }
    bouncer();
  }, [SearchText]);

  function handleSelect(videoId: string, title: string) {
    setSearchText("");
    setSearchResult([]);
    store.setQuery(videoId, title);
  }

  return (
    <div className="mb-8 relative">
      <Search
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        placeholder="Search for songs, artists, albums..."
        className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
        value={SearchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <div
        className="text-white absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto
 backdrop-blur-sm border border-gray-800 rounded-xl shadow-xl z-50"
      >
        <ul className="divide-y divide-gray">
          {searchResult &&
            searchResult.map((song: any) => (
              <li
                key={song.id.videoId}
                className="px-4 py-3 hover:bg-red-300 cursor-pointer"
                onClick={() => {
                  handleSelect(song.id.videoId, song.snippet.title);
                }}
              >
                {song.snippet.title}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
