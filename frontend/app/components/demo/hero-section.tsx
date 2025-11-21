import { Play } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative h-80 rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-purple-900 via-pink-800 to-cyan-800">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative h-full flex items-center p-12">
        <div className="max-w-2xl">
          <h2 className="text-6xl font-bold text-white mb-4">Your Daily Mix</h2>
          <p className="text-xl text-gray-200 mb-6">
            Discover new tracks curated just for you
          </p>
          <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
            <Play size={20} fill="black" />
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}
