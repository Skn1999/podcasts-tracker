import { Link } from "remix";

export default function Logo() {
  return (
    <div
      className="flex-shrink-0 text-xl relative font-mono"
      aria-label="Podcast Tracker"
    >
      <Link to={"/"}>🎧 Podcast Tracker</Link>
    </div>
  );
}
