"use client";

import TextType from "@/components/test-type";
import Image from "next/image";

export default function ProfilePondok() {
  return (
    <section
      id="profile-desa"
      className="relative w-full h-[600px] pt-32 lg:pt-0 md:h-[700px] lg:h-[800px] bg-black/80 overflow-hidden flex items-center justify-center" // Centering content
    >
      {/* Background Image */}
      <Image
        src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brKv0lD014VcdFfpgaC3D2L58U6OKsuJSRx9Yb"
        alt="Background Pondok Pesantren"
        fill
        style={{ objectFit: "cover" }}
        quality={90}
        objectPosition="center"
        className="absolute inset-0 z-0"
        priority
      />

      {/* Overlay Hitam */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 flex items-center justify-center h-full">
        {/* Adjusted content to be centered and mimic the image layout */}
        <div className="text-white text-center">
          <p className="text-sm uppercase tracking-widest mb-2 border-b border-t border-white py-1 inline-block px-4">
            Profile
          </p>
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold leading-tight mt-0 mb-4">
            <span className="text-green-700">
              <TextType
                text={["Pondok Pesantren", "Pasar Santri", "Ekonomi Syariah"]} // Example texts for typing effect
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                textColors={["#45a544ff"]} // This will apply the color directly to the span wrapping TextType
              />
            </span>
          </h1>
          <div className="border border-white p-6 inline-block">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              Profil Pondok Pesantren
            </h2>
            <p className="text-sm text-neutral-200">
              Membentuk generasi islami yang
              <br />
              berakhlak mulia dan berwawasan luas.
              <br />
              Pendidikan holistik untuk masa depan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}