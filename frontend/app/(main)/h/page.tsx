import Hero from "@/app/components/home/hero";

export default function Browser() {
  return (
    <div className="w-full">
      <div className="w-full p-3">
        <input
          type="text"
          placeholder="Search for songs, albums, or artists"
          className="w-full border-2 border-black rounded-3xl bg-amber-500/90 p-2 text-2xl"
        />
      </div>
      <Hero />
    </div>
  );
}
