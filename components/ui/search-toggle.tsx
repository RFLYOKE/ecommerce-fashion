"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import clsx from "clsx";

export default function SearchToggle() {
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const isWisataPage = pathname === "/wisata" || pathname === "/profile";

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isWisataPage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isWisataPage]);

  // Fokus otomatis saat input muncul
  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  return (
    <div className="relative transition-all duration-300">
      {!showInput ? (
        <div
          onClick={() => setShowInput(true)}
          className={clsx(
            "flex items-center gap-2 text-sm cursor-pointer transition-colors duration-300",
            isWisataPage
              ? isScrolled
                ? "text-green-800 hover:text-[#5b0f0f]"
                : "text-white hover:text-white/70"
              : "text-gray-800 hover:text-green-600"
          )}
        >
          <IconSearch size={18} />
        </div>
      ) : (
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari..."
          className={clsx(
            "border px-3 py-1 rounded-md text-sm focus:outline-none transition-all duration-300",
            isWisataPage
              ? isScrolled
                ? "border-gray-300 text-black placeholder-gray-500 bg-white focus:border-green-600 focus:ring-green-600"
                : "border-white bg-transparent text-white placeholder-white focus:border-white focus:ring-white"
              : "border-gray-300 text-black placeholder-gray-500 bg-white focus:border-green-600 focus:ring-green-600"
          )}
          onBlur={() => setShowInput(false)}
        />
      )}
    </div>
  );
}