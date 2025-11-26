import HeroSection from "@/app/components/demo/hero-section";
import SearchComponent from "@/app/components/demo/search";
import { SongCard } from "@/app/components/demo/song-card";

export default function pageSection() {
  const recentSongs = [
    {
      title: "Midnight City",
      artist: "M83",
      image: "from-purple-500 to-blue-500",
      duration: "4:04",
    },
    {
      title: "Starboy",
      artist: "The Weeknd",
      image: "from-pink-500 to-orange-500",
      duration: "3:50",
    },
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      image: "from-cyan-500 to-blue-500",
      duration: "3:20",
    },
    {
      title: "Electric Feel",
      artist: "MGMT",
      image: "from-green-500 to-teal-500",
      duration: "3:49",
    },
    {
      title: "Take On Me",
      artist: "a-ha",
      image: "from-yellow-500 to-red-500",
      duration: "3:46",
    },
    {
      title: "Resonance",
      artist: "HOME",
      image: "from-indigo-500 to-purple-500",
      duration: "3:32",
    },
  ];

  const playlists = [
    {
      title: "Synthwave Nights",
      artist: "24 tracks",
      image: "from-purple-600 to-pink-600",
    },
    {
      title: "Chill Vibes",
      artist: "18 tracks",
      image: "from-cyan-600 to-blue-600",
    },
    {
      title: "Workout Mix",
      artist: "32 tracks",
      image: "from-orange-600 to-red-600",
    },
    {
      title: "Focus Flow",
      artist: "40 tracks",
      image: "from-green-600 to-teal-600",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      <div className="p-8">
        {/* Search */}
        <SearchComponent />

        {/* Hero Section */}
        <HeroSection />

        {/* Recently Played */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Recently Played</h2>
            <button className="text-gray-400 hover:text-white transition-colors">
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentSongs.map((song, index) => (
              <SongCard key={index} {...song} />
            ))}
          </div>
        </section>

        {/* Your Playlists */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Your Playlists</h2>
            <button className="text-gray-400 hover:text-white transition-colors">
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {playlists.map((playlist, index) => (
              <SongCard key={index} {...playlist} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
