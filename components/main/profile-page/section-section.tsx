"use client";

import Image from "next/image";

export default function SectionSambutanUstad() {
  return (
    <section className="relative py-20 bg-[#2b584d]" id="sambutan-ustad">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Gambar Ustad */}
        <div className="relative flex justify-center md:justify-start">
          <Image
            src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6br0XmRW1PuLsfMWxTRcaNjB2YECgIUnQpo9vwi"
            alt="Ustad"
            width={500} // Adjust width as needed
            height={500} // Adjust height as needed
            style={{ objectFit: "cover" }}
            className="relative z-10 rounded-full" // Remove rounded-b-full and negative top margin
            priority
          />
        </div>

        {/* Deskripsi */}
        <div className="bg-[#4d7d70] p-8 text-white shadow-md text-center md:text-left rounded-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            SAMBUTAN KETUA PONDOK PESANTREN.
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-neutral-100 mb-6">
            Assalamualaikum Warahmatullahi Wabarakatuh.
            <br />
            Selamat datang di Pondok Pesantren kami. Dengan rahmat Allah SWT,
            kami berkomitmen untuk mendidik generasi muda yang beriman,
            bertakwa, dan berakhlak mulia, serta memiliki ilmu yang bermanfaat
            bagi agama, bangsa, dan negara. Semoga keberadaan pondok pesantren
            ini senantiasa menjadi berkah bagi kita semua.
            <br />
            Wassalamualaikum Warahmatullahi Wabarakatuh.
          </p>
          <div className="space-y-4">
            <div className="flex items-center text-left">
              <span className="mr-3">📍</span>
              <div>
                <h3 className="font-bold text-lg">ALAMAT KAMI</h3>
                <p className="text-sm text-neutral-200">
                  Jl. Contoh No. 123, Desa Damai, Kota Santri.
                </p>
              </div>
            </div>
            <div className="flex items-center text-left">
              <span className="mr-3">📞</span>
              <div>
                <h3 className="font-bold text-lg">HUBUNGI KAMI</h3>
                <p className="text-sm text-neutral-200">+62 812-3456-7890</p>
              </div>
            </div>
            <div className="flex items-center text-left">
              <span className="mr-3">📧</span>
              <div>
                <h3 className="font-bold text-lg">EMAIL KAMI</h3>
                <p className="text-sm text-neutral-200">
                  info@pondokpesantren.com
                </p>
              </div>
            </div>
            <div className="flex items-center text-left">
              <span className="mr-3">🌐</span>
              <div>
                <h3 className="font-semibold text-lg">IKUTI KAMI</h3>
                <p className="text-sm text-neutral-200">@pondokpesantrenku</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}