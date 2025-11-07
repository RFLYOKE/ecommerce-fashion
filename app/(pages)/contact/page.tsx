"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Instagram,
  Facebook,
} from "lucide-react";

/*
  ContactPage – white background, black accents, elegant & animated.
  Drop as: app/contact/page.tsx (Next.js App Router)
  TailwindCSS + Framer Motion only.
*/

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const WHATSAPP_1 = "+62895622717884"; // 0895 6227 17884
const WHATSAPP_2 = "+6281299848516"; // 0812 9984 8516
const ADDRESS = "Jatijajar, Depok, Jawa Barat 16455";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = useMemo(() => {
    const to = "hello@blackboxinc.example"; // ganti sesuai email brand
    const s = encodeURIComponent(subject || "Pertanyaan dari Website");
    const body = encodeURIComponent(
      `Halo Blackboxinc,\n\nNama: ${name}\nEmail: ${email}\n\n${message}`
    );
    return `mailto:${to}?subject=${s}&body=${body}`;
  }, [name, email, subject, message]);

  return (
    <main className="relative min-h-screen bg-white">
      {/* HERO */}
      <section className="container mx-auto px-6 pb-16 md:pt-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-black"
          >
            Contact Us
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-3 text-base md:text-lg text-gray-600"
          >
            Kami siap membantu — hubungi kami lewat WhatsApp, email, atau isi
            formulir di bawah ini.
          </motion.p>
        </motion.div>
      </section>

      {/* CONTACT GRID */}
      <section className="container mx-auto grid grid-cols-1 gap-8 px-6 pb-24 md:grid-cols-3">
        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="space-y-6 md:col-span-1"
        >
          {/* WhatsApp */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <MessageCircle className="h-5 w-5 text-gray-900" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">WhatsApp</h3>
                <div className="mt-2 space-y-2 text-gray-700">
                  <p className="text-sm">
                    No wa :{" "}
                    <Link
                      href={`https://wa.me/${WHATSAPP_1}`}
                      target="_blank"
                      className="underline underline-offset-4 hover:text-black"
                    >
                      0895 6227 17884
                    </Link>{" "}
                    /{" "}
                    <Link
                      href={`https://wa.me/${WHATSAPP_2}`}
                      target="_blank"
                      className="underline underline-offset-4 hover:text-black"
                    >
                      0812 9984 8516
                    </Link>
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`https://wa.me/${WHATSAPP_1}`}
                    target="_blank"
                    className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-900 flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" /> Chat WA 1
                  </Link>
                  <Link
                    href={`https://wa.me/${WHATSAPP_2}`}
                    target="_blank"
                    className="rounded-lg border border-black px-4 py-2 text-xs font-semibold text-black hover:bg-black hover:text-white flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" /> Chat WA 2
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <MapPin className="h-5 w-5 text-gray-900" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">Alamat</h3>
                <p className="mt-2 text-sm text-gray-700">Alamat : {ADDRESS}</p>
                <div className="mt-3">
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      ADDRESS
                    )}`}
                    target="_blank"
                    className="rounded-lg border border-black px-4 py-2 text-xs font-semibold text-black hover:bg-black hover:text-white inline-flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" /> Lihat di Maps
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hours & Socials */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <Clock className="h-5 w-5 text-gray-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black">
                  Jam Operasional
                </h3>
                <p className="mt-2 text-sm text-gray-700">
                  Senin–Minggu: 09.00 – 21.00 WIB
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href="#"
                    className="rounded-full border border-black p-2 text-black hover:bg-black hover:text-white"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#"
                    className="rounded-full border border-black p-2 text-black hover:bg-black hover:text-white"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </Link>
                  <Link
                    href="mailto:hello@blackboxinc.example"
                    className="rounded-full border border-black p-2 text-black hover:bg-black hover:text-white"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="md:col-span-2"
        >
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-bold text-black">Kirim Pesan</h3>
            <p className="mt-1 text-sm text-gray-600">
              Isi form berikut—kami akan membalas secepatnya.
            </p>

            <form
              className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                // fallback: buka mail client
                window.location.href = mailtoHref;
              }}
            >
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="text-xs font-semibold text-black"
                >
                  Nama
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 outline-none ring-0 focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-black"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 outline-none ring-0 focus:border-black"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label
                  htmlFor="subject"
                  className="text-xs font-semibold text-black"
                >
                  Subjek
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Judul pesan"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 outline-none ring-0 focus:border-black"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label
                  htmlFor="message"
                  className="text-xs font-semibold text-black"
                >
                  Pesan
                </label>
                <textarea
                  id="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis pesanmu di sini..."
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 outline-none ring-0 focus:border-black"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-900"
                >
                  <Send className="h-4 w-4" /> Kirim Pesan
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}