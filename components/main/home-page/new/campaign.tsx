"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Sparkles,
  Tag,
  Zap,
  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, finished: diff === 0 } as const;
}

export default function Campaign({
  end,
  code = "BLACKBOX20",
  percentClaimed = 52,
}: {
  end?: string | Date;
  code?: string;
  percentClaimed?: number;
}) {
  const target = useMemo(() => {
    if (end) return new Date(end);
    const d = new Date();
    d.setDate(d.getDate() + 5);
    d.setHours(23, 59, 59, 0);
    return d;
  }, [end]);

  const { days, hours, minutes, seconds, finished } = useCountdown(target);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const safePercent = Math.max(0, Math.min(100, Math.round(percentClaimed)));

  return (
    <section className="relative isolate">
      {/* background merah elegan */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-600 via-red-700 to-rose-900" />
      <div className="absolute inset-x-0 -top-24 -z-10 h-48 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(255,255,255,0.18),transparent)]" />

      <div className="mx-auto   px-4 py-10 sm:py-12 md:py-14">
        {/* Headline */}
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-rose-50/80" />
          <p className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-50/90">
            Blackboxinc Campaign
          </p>
          <Sparkles className="h-5 w-5 text-rose-50/80" />
        </div>

        <h2 className="mt-3 text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
          Mid-Season Deals — Hemat Hingga{" "}
          <span className="underline decoration-white/40">20%</span>
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-rose-50/80">
          Gunakan kode kupon berikut. Berlaku hingga kampanye berakhir atau
          selama persediaan masih ada.
        </p>

        {/* Grid: countdown + coupon + progress */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Countdown */}
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-rose-50/90">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium tracking-wide">
                Berakhir Dalam
              </span>
            </div>
            <div className="flex items-center justify-between text-white">
              {[
                { label: "Hari", value: days },
                { label: "Jam", value: hours },
                { label: "Menit", value: minutes },
                { label: "Detik", value: seconds },
              ].map((seg) => (
                <div key={seg.label} className="flex flex-col items-center">
                  <div className="min-w-[58px] rounded-xl bg-red-900/50 px-3 py-2 text-center text-2xl font-bold leading-none shadow-inner">
                    {String(seg.value).padStart(2, "0")}
                  </div>
                  <span className="mt-1 text-[10px] uppercase tracking-wider text-rose-50/70">
                    {seg.label}
                  </span>
                </div>
              ))}
            </div>
            {finished && (
              <p className="mt-3 text-center text-xs text-rose-200">
                Kampanye berakhir
              </p>
            )}
          </div>

          {/* Coupon */}
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-rose-50/90">
              <Tag className="h-4 w-4" />
              <span className="text-xs font-medium tracking-wide">
                Kode Kupon
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-red-900/60 px-3 py-2 font-mono text-lg font-bold tracking-wider text-white">
                  {code}
                </span>
              </div>
              <button
                onClick={onCopy}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                aria-label="Copy coupon code"
              >
                <Zap className="h-4 w-4" />
                {copied ? "Disalin!" : "Salin"}
              </button>
            </div>
            <p className="mt-2 text-xs text-rose-50/70">
              Masukkan saat checkout. S&K berlaku.
            </p>
          </div>

          {/* Progress */}
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-rose-50/90">
              <Truck className="h-4 w-4" />
              <span className="text-xs font-medium tracking-wide">
                Klaim Promo
              </span>
            </div>
            <div className="relative h-10 overflow-hidden rounded-xl border border-white/10 bg-red-900/30">
              <div
                className="h-full bg-gradient-to-r from-rose-300 to-red-200"
                style={{ width: `${safePercent}%` }}
                aria-hidden
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                {safePercent}% Terpakai
              </div>
            </div>
            <p className="mt-2 text-xs text-rose-50/70">
              Stok promo terbatas. Segera checkout sebelum habis.
            </p>
          </div>
        </div>

        {/* Perks */}
        <div className="mt-6 grid grid-cols-1 gap-3 text-rose-50/90 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs">Garansi 30 hari</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2">
            <Truck className="h-4 w-4" />
            <span className="text-xs">Gratis ongkir tertentu</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2">
            <Headphones className="h-4 w-4" />
            <span className="text-xs">Support 24/7</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/product?campaign=mid-season"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 px-5 py-3 text-sm font-bold text-white transition hover:from-rose-600 hover:to-red-700"
          >
            Belanja Sekarang
          </Link>
          <Link
            href="/how-to-order"
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Lihat S&K
          </Link>
        </div>
      </div>
    </section>
  );
}
