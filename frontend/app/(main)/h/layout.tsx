import "./home.scss";
export default function HomePageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      style={{
        height: "100dvh",
        width: "100dvw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="main-section">
        {/* Nav section */}
        <div className="nav bg-amber-500/90 p-2">
          <h1 className="text-5xl">Play Join</h1>
          <div className="text-4xl flex flex-col gap-2.5">
            <p>Home</p>
            <p>Discover</p>
            <p>Radio</p>
            <p>Library</p>
            <p>Settings</p>
          </div>
        </div>

        {/* Main Section */}
        <div className="w-full">{children}</div>
      </div>

      {/* Music Player */}
      <div></div>
    </div>
  );
}
