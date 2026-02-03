import { Link, useLocation } from "react-router";

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="absolute top-0 left-0 right-0 flex gap-1 p-3 justify-center z-10">
      <Link
        to="/"
        className={`px-3 py-1.5 rounded-full text-xs transition-all backdrop-blur-sm ${
          location.pathname === "/"
            ? "bg-gray-900/90 text-white shadow-lg"
            : "bg-white/70 text-gray-700 hover:bg-white/90"
        }`}
      >
        Lv.1
      </Link>
      <Link
        to="/level2"
        className={`px-3 py-1.5 rounded-full text-xs transition-all backdrop-blur-sm ${
          location.pathname === "/level2"
            ? "bg-amber-800/90 text-white shadow-lg"
            : "bg-white/70 text-gray-700 hover:bg-white/90"
        }`}
      >
        Lv.2
      </Link>
      <Link
        to="/level3"
        className={`px-3 py-1.5 rounded-full text-xs transition-all backdrop-blur-sm ${
          location.pathname === "/level3"
            ? "bg-amber-900/90 text-white shadow-lg"
            : "bg-white/70 text-gray-700 hover:bg-white/90"
        }`}
      >
        Lv.3
      </Link>
    </nav>
  );
}