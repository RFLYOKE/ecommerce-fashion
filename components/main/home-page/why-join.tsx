"use client";

import {
  Users,
  Handshake,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Globe,
} from "lucide-react";

export default function WhyJoinPesantrenSection() {
  // Renamed component for clarity
  const reasons = [
    {
      icon: <Users className="w-10 h-10 text-green-700" />, // Adjusted color shade for consistency
      title: "Berkah Berjamaah",
      desc: "Marketplace ini dibangun atas dasar kebersamaan dan saling mendukung antar santri, alumni, dan masyarakat pesantren.",
    },
    {
      icon: <Handshake className="w-10 h-10 text-green-700" />,
      title: "Kemandirian Ekonomi Umat",
      desc: "Menjadi bagian dari ekosistem yang berupaya mewujudkan kemandirian ekonomi umat melalui produk halal dan berkualitas.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-green-700" />,
      title: "Transaksi Syariah & Amanah",
      desc: "Sistem pengelolaan keuangan dan transaksi yang terbuka, jujur, dan sesuai prinsip syariah.",
    },
    {
      icon: <Smartphone className="w-10 h-10 text-green-700" />,
      title: "Platform Digital Pesantren",
      desc: "Akses mudah ke berbagai produk dan layanan pondok pesantren cukup lewat aplikasi digital.",
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-green-700" />,
      title: "Pemberdayaan Santri & UMKM",
      desc: "Setiap pembelian dan partisipasi langsung berkontribusi pada pengembangan keterampilan santri dan UMKM pondok.",
    },
    {
      icon: <Globe className="w-10 h-10 text-green-700" />,
      title: "Jaringan Ukhuwah Ekonomi",
      desc: "Memperluas jaringan silaturahmi dan kerjasama ekonomi di antara komunitas pesantren dan masyarakat luas.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {" "}
          {/* Adjusted text color for consistency */}
          Kenapa Harus <span className="text-green-700">Bergabung?</span>
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-12">
          {" "}
          {/* Adjusted text color for consistency */}
          Bergabung denganBLACKBOXINC bukan sekadar berbelanja atau
          bertransaksi, tapi menjadi bagian dari gerakan ekonomi syariah yang
          memberdayakan komunitas pesantren dan masyarakat.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-green-50 rounded-xl shadow-sm p-6 hover:shadow-lg hover:-translate-y-2 transition border border-green-100" // Adjusted background and border
            >
              <div className="flex flex-col items-center space-y-4">
                {reason.icon}
                <h3 className="text-xl font-semibold text-gray-900 text-center">
                  {" "}
                  {/* Adjusted text color and size */}
                  {reason.title}
                </h3>
                <p className="text-sm text-gray-700 text-center">
                  {" "}
                  {/* Adjusted text color */}
                  {reason.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
