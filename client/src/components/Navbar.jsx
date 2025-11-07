import React, { useEffect, useState } from "react";
import { User, Code, LogOut, Flame, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore.js";
import LogoutButton from "./LogoutButton.jsx";

import Logo from "../assets/Logo.png";

const getStreak = () => {
  const data = JSON.parse(localStorage.getItem("streakData"));
  return data?.streakCount || 0;
};

const Navbar = () => {
  const { authUser } = useAuthStore();
  const location = useLocation();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
  }, [authUser]);

  useEffect(() => {
    const handleUpdate = () => setStreak(getStreak());
    window.addEventListener("streakUpdated", handleUpdate);
    return () => window.removeEventListener("streakUpdated", handleUpdate);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full py-4 px-3">
      <div className="flex justify-between items-center mx-auto max-w-6xl bg-gray-900/70 shadow-lg shadow-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl transition-all duration-300">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={Logo}
            alt="AlgoHol!c Logo"
            className="h-17 w-17 rounded-full border border-indigo-500 shadow-md object-cover bg-black/5"
          />

          <motion.span
            className="text-xl md:text-2xl font-bold tracking-tight text-white hidden md:block"
            whileHover={{ color: "#6366f1" }}
          >
            AlGoHol!c
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link
            to="/"
            className={`hover:text-indigo-400 transition ${
              location.pathname === "/" ? "text-indigo-400" : ""
            }`}
          >
            Home
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {authUser && (
            <motion.div
              className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 rounded-full text-orange-300 font-medium cursor-default shadow-sm hover:shadow-orange-500/20 transition-all"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Flame
                className="size-5 text-orange-400 animate-pulse"
                strokeWidth={2.3}
              />
              <span>
                {streak} day{streak !== 1 && "s"}
              </span>
            </motion.div>
          )}

          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar flex flex-row"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-indigo-400/30 hover:border-indigo-400 transition">
                <motion.img
                  src={
                    authUser?.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User Avatar"
                  className="object-cover w-full h-full"
                  whileHover={{ scale: 1.1 }}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://avatar.iran.liara.run/public/boy";
                  }}
                />
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-gray-800/90 backdrop-blur-lg rounded-2xl w-56 space-y-2 border border-white/10"
            >
              {authUser && (
                <li className="px-2 py-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 mb-2">
                  <div className="flex flex-col items-start">
                    <span className="text-white font-semibold text-base">
                      {authUser.name}
                    </span>
                  </div>
                </li>
              )}

              <li>
                <Link
                  to="/profile"
                  className="flex items-center hover:bg-indigo-500/20 rounded-lg p-2 text-gray-200 transition-all"
                >
                  <User className="w-4 h-4 mr-2 text-indigo-400" />
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/playlists"
                  className="flex items-center hover:bg-indigo-500/20 rounded-lg p-2 text-gray-200 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 mr-2 text-indigo-400"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  My Playlists
                </Link>
              </li>

              {authUser?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/add-problem"
                    className="flex items-center hover:bg-indigo-500/20 rounded-lg p-2 text-gray-200 transition-all"
                  >
                    <Code className="w-4 h-4 mr-2 text-indigo-400" />
                    Add Problem
                  </Link>
                </li>
              )}

              <li>
                <LogoutButton className="flex items-center hover:bg-rose-500/20 rounded-lg p-2 text-gray-200 transition-all">
                  <LogOut className="w-4 h-4 mr-2 text-rose-400" />
                  Logout
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
