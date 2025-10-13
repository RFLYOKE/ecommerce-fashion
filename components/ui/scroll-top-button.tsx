"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    setIsAnimating(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Reset animation state after scroll completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 group transition-all duration-500 transform ${
        showButton
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      {/* Main Button */}
      <div className="relative">
        {/* Background with gradient */}
        <div className="w-14 h-14 bg-gradient-to-br from-[#6B6B6B] to-[#A3A3A3] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
          {/* Animated border ring */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6B6B6B] to-[#A3A3A3] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>

          {/* Inner content */}
          <div className="relative z-10 text-white transition-transform duration-300 group-hover:scale-110">
            <ArrowUp
              className={`w-6 h-6 transition-transform duration-300 ${
                isAnimating ? "animate-bounce" : "group-hover:-translate-y-1"
              }`}
            />
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm font-medium px-3 py-2 rounded-xl whitespace-nowrap shadow-lg">
            Kembali ke atas
            {/* Arrow pointer */}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </div>

        {/* Progress ring (optional enhancement) */}
        <svg
          className="absolute inset-0 w-14 h-14 transform -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          viewBox="0 0 56 56"
        >
          <circle
            cx="28"
            cy="28"
            r="26"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Ripple effect on click */}
      <div
        className={`absolute inset-0 rounded-2xl bg-white opacity-0 ${
          isAnimating ? "animate-ping" : ""
        }`}
      ></div>
    </button>
  );
}
