export default function Hero() {
  return (
    <div className="py-16 px-10 m-3 rounded-3xl justify-center text-left bg-amber-500/60 text-3xl border-2 border-black">
      <h1 className="text-5xl mb-2">WANA PLAY SOME RANDOM MUSIC ?</h1>
      {/* Replace this one */}
      <span>Discover new tracks curated just for you</span>{" "}
      <button className="px-8 py-4 bg-white text-black mt-4 font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
        Play Now
      </button>
    </div>
  );
}
