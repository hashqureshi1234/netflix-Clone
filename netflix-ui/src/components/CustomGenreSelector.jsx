import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


const glassStyles =
  "bg-black/40 backdrop-blur-md border border-white/30 shadow-lg";

export default function CustomGenreSelector({
  genres = [],
  selectedGenre,
  onSelect,
  label = "Select Genre",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div
      ref={ref}
      className={`sticky top-0 z-30 flex flex-col items-start w-full max-w-xs mx-auto mt-4 mb-6`}
    >
      <button
        type="button"
        className={`w-full flex items-center justify-between px-5 py-3 rounded-xl ${glassStyles} transition-all duration-200 cursor-pointer`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-semibold text-white truncate">
          {selectedGenre
            ? genres.find((g) => g.id === selectedGenre)?.name || label
            : label}
        </span>
        <svg
          className={`w-5 h-5 ml-2 text-white transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, scaleY: 0.8, y: -10 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.8, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={`w-full mt-2 rounded-xl overflow-hidden ${glassStyles} border-t-0`}
            style={{ originY: 0 }}
          >
            {genres.map((genre) => (
              <li
                key={genre.id}
                className={`px-5 py-3 cursor-pointer transition-colors duration-200 ${
                  selectedGenre === genre.id
                    ? "bg-red-600 text-white"
                    : "hover:bg-red-600/80 hover:text-white"
                }`}
                onClick={() => {
                  onSelect(genre.id);
                  setOpen(false);
                }}
              >
                {genre.name}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
