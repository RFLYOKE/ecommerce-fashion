"use client";
import Image from "next/image";
import { Star } from "lucide-react"; // Import Star icon for the rating
import TextType from "@/components/test-type";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <div className="relative bg-white overflow-hidden min-h-screen w-full flex items-center">
      {/* Background shape - Dark Green Triangle (emulating the image's bottom-left) */}
      <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[200px] border-b-green-800 border-r-[200px] border-r-transparent z-10 md:border-b-[300px] md:border-r-[300px] lg:border-b-[400px] lg:border-r-[400px]"></div>

      {/* Overlay Gradasi Hijau */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-green-800 to-transparent z-20 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-20 w-full mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-8 py-16 lg:py-0">
        {/* Text Section (Left Side) */}
        <div className="text-center lg:text-left space-y-6 flex-1 lg:max-w-xl -translate-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Produk Berkualitas
            <span className="text-green-700">
              <TextType
                text={["Pondok Pesantren", "Pasar Santri", "Ekonomi Syariah"]} // Example texts for typing effect
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                textColors={["#306c2fff"]}
              />
            </span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
            Jelajahi beragam produk sehat dan halal dari Pondok Pesantren
            pilihan. Dukung ekonomi umat, rasakan keberkahannya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button
              type="button"
              onClick={() => router.push("/product")}
              className="bg-green-700 text-white font-semibold px-8 py-3 rounded-lg text-lg hover:bg-green-800 transition-colors shadow-md"
            >
              Lihat Produk
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("join");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-transparent text-green-700 border border-green-700 font-semibold px-8 py-3 rounded-lg text-lg hover:bg-green-700 hover:text-white transition-colors shadow-md"
            >
              Gabung Mitra
            </button>
          </div>
        </div>

        {/* Hero Image Section (Right Side) */}
        <div className="flex justify-center lg:justify-end flex-1 relative w-full lg:w-1/2 h-[500px] lg:h-[700px] xl:h-[800px]">
          <Image
            src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brnraOVyiFGYbO6ENcezCmHarVMk2LvX7TtZ1j"
            alt="Santri Chef with Healthy Food"
            fill
            className="object-cover rounded-xl z-20"
            priority
          />

          {/* Customer Rating Badge */}
          <div className="hidden lg:flex absolute bottom-1/2 -right-12 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-4 flex-col items-start gap-2 z-30 border border-gray-100">
            <span className="text-sm font-semibold text-gray-800">
              Rating Pelanggan
            </span>
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className="fill-yellow-500 stroke-yellow-500"
                />
              ))}
              <span className="text-gray-900 font-bold ml-1">5.0</span>
            </div>
            <p className="text-xs text-gray-600">Berdasarkan 500+ ulasan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
