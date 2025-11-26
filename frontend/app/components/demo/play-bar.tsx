"use client";

import { store } from "@/app/store";
import {
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { YouTubePlayer } from "youtube-player/dist/types";

export default observer(function PlayerBar() {
  const [clicked, setClicked] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(true);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const playerRef = useRef<YouTubePlayer | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (store.videoId === "") return;
    if (window.YT && window.YT.Player) initPlayer();
    else window.onYouTubeIframeAPIReady = initPlayer;

    async function initPlayer() {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId: store.videoId,
        playerVars: { enablejsapi: 1, autoplay: 1 },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [store.videoId]);

  async function onPlayerReady() {
    if (!playerRef.current) return;
    const duration = await playerRef.current.getDuration();
    setTotalDuration(duration);
    setCurrentTime(0);
  }

  function onPlayerStateChange(event: any) {
    // 0 = UNSTARTED, 1 = PLAYING, 2 = PAUSED, 3 = BUFFERING, 5 = CUED
    const isPlayerPlaying = event.data === window.YT.PlayerState.PLAYING;
    setIsPlaying(isPlayerPlaying);

    // Start/stop update interval based on playback state
    if (isPlayerPlaying) {
      if (!updateIntervalRef.current) {
        updateIntervalRef.current = setInterval(updateTime, 100);
      }
    } else {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    }
  }

  async function updateTime() {
    if (!playerRef.current) return;
    try {
      const current = await playerRef.current.getCurrentTime();
      setCurrentTime(Math.floor(current));
    } catch (error) {
      console.error("Error updating time:", error);
    }
  }

  //Sets volume and, stops and plays the video
  useEffect(() => {
    if (store.videoId === "" || !playerRef.current) return;

    async function handleStateChange() {
      try {
        await playerRef.current?.setVolume(volume);
        if (isPlaying) {
          await playerRef.current?.playVideo();
        } else {
          await playerRef.current?.pauseVideo();
        }
      } catch (error) {
        console.error("Error updating player state:", error);
      }
    }
    handleStateChange();
  }, [volume, isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-2xl border-t border-white/10 px-6 flex items-center justify-between ${
        clicked ? "h-full" : "h-24"
      } ${store.videoId !== "" && "cursor-pointer"}`}
      onClick={() => {
        if (store.videoId === "") return;
        setClicked((prev) => !prev);
      }}
    >
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
      />
      <div
        className={`flex items-center gap-4 flex-1 transition-transform duration-300 ${
          clicked && "flex-col-reverse"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-16 h-16 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
            🎵
          </div>
          <div>
            <h4 className="text-white font-semibold">{store.title}</h4>
          </div>
        </div>
        {/* Player controls */}
        {store.videoId !== "" && (
          <div
            className={`flex-1 flex flex-col items-center gap-2 ${
              clicked && "hidden"
            }`}
          >
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <SkipBack size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
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
              <span className="text-xs text-gray-400">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                  style={{
                    width: `${
                      totalDuration > 0
                        ? (currentTime / totalDuration) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-400">
                {formatTime(totalDuration)}
              </span>
            </div>
          </div>
        )}

        <div
          className={`flex items-center justify-end gap-3 ${
            (clicked || store.videoId === "") && "hidden"
          }`}
        >
          <Volume2
            size={20}
            className="text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <input
            type="range"
            value={volume}
            onChange={(e) => {
              e.stopPropagation();
              setVolume(Number(e.target.value));
            }}
            className="w-24 accent-purple-500"
          />
        </div>
        <div
          className={`transition-transform duration-300 ${
            clicked ? "translate-y-0" : "translate-y-full hidden"
          }`}
        >
          <div id="yt-player"></div>
        </div>
      </div>
    </div>
  );
});
