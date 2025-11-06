// Campaign.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
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
import clsx from "clsx";

// pakai hook dari service kamu
import { useGetVoucherListQuery } from "@/services/voucher.service";

// === UI type (longgar, mengikuti response; field tertentu opsional)
type UIVoucher = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  fixed_amount?: number | null;
  percentage_amount?: number | null;
  type?: string;
  start_date: string; // "YYYY-MM-DD"
  end_date: string; // "YYYY-MM-DD"
  usage_limit?: number | null;
  used_count?: number | null;
  status?: boolean;
};

// === countdown
function useCountdown(target: Date | null) {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!target)
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      finished: false,
    } as const;

  const diff = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, finished: diff === 0 } as const;
}

const parseYMD = (d: string) => {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1);
};

export default function Campaign() {
  // ✅ FIX 1: kasih argumen page & paginate
  const { data, isLoading, isError } = useGetVoucherListQuery({
    page: 1,
    paginate: 10,
  });

  // ✅ FIX 2: hasil transformResponse = { data: Voucher[], ... }
  const vouchers: UIVoucher[] = (data?.data as UIVoucher[]) ?? [];

  // pilih voucher prioritas: aktif → upcoming → terakhir
  const selected: UIVoucher | undefined = useMemo(() => {
    if (!vouchers.length) return undefined;
    const now = new Date();

    const withDates = vouchers.map((v) => ({
      v,
      start: parseYMD(v.start_date),
      end: new Date(parseYMD(v.end_date).setHours(23, 59, 59, 999)),
    }));

    const active = withDates
      .filter(({ start, end }) => start <= now && now <= end)
      .sort((a, b) => a.end.getTime() - b.end.getTime());
    if (active.length) return active[0].v;

    const upcoming = withDates
      .filter(({ start }) => start > now)
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    if (upcoming.length) return upcoming[0].v;

    return withDates.sort((a, b) => b.end.getTime() - a.end.getTime())[0].v;
  }, [vouchers]);

  // tentukan target countdown & label
  const { target, phaseLabel, ended } = useMemo(() => {
    if (!selected)
      return { target: null, phaseLabel: "Campaign", ended: true as boolean };
    const now = new Date();
    const start = parseYMD(selected.start_date);
    const end = new Date(parseYMD(selected.end_date).setHours(23, 59, 59, 999));

    if (now < start)
      return { target: start, phaseLabel: "Starts In", ended: false };
    if (now <= end) return { target: end, phaseLabel: "Ends In", ended: false };
    return { target: end, phaseLabel: "Campaign Ended", ended: true };
  }, [selected]);

  const { days, hours, minutes, seconds } = useCountdown(target);

  // UI fields
  const code = selected?.code ?? "—";
  const name = selected?.name ?? "Seasonal Sale";
  const description =
    selected?.description ?? "Use the code below at checkout.";
  const isPercentage = (selected?.type ?? "").toLowerCase() === "percentage";
  const discountText = isPercentage
    ? `${selected?.percentage_amount ?? 0}% Off`
    : selected?.fixed_amount
    ? `Rp ${Number(selected.fixed_amount).toLocaleString("id-ID")} Off`
    : "Special Offer";

  // ✅ FIX 3: field usage/used opsional
  const usageLimit = selected?.usage_limit ?? 0;
  const usedCount = selected?.used_count ?? 0;
  const percentClaimed =
    usageLimit > 0
      ? Math.min(100, Math.round((usedCount / usageLimit) * 100))
      : 0;
  const safePercent = Math.max(0, Math.min(100, percentClaimed));

  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90" />
      <div className="absolute inset-x-0 -top-24 -z-10 h-48 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(255,255,255,0.08),transparent)]" />

      <div className="mx-auto container px-4 py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-gray-400" />
          <p className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
            Blackboxinc Exclusive
          </p>
          <Sparkles className="h-5 w-5 text-gray-400" />
        </div>

        <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          {name} —{" "}
          <span className="underline decoration-gray-400/50">
            {discountText}
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-gray-400 sm:text-lg">
          {isLoading
            ? "Loading vouchers…"
            : isError
            ? "Failed to load vouchers."
            : description}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 max-w-5xl mx-auto">
          {/* COUNTDOWN */}
          <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-5 backdrop-blur-sm shadow-lg">
            <div className="mb-3 flex items-center gap-2 text-gray-300">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wide uppercase">
                {phaseLabel}
              </span>
            </div>

            {!ended ? (
              <div className="flex items-center justify-between text-white">
                {[
                  { label: "Days", value: days },
                  { label: "Hours", value: hours },
                  { label: "Minutes", value: minutes },
                  { label: "Seconds", value: seconds },
                ].map((seg) => (
                  <div key={seg.label} className="flex flex-col items-center">
                    <div className="min-w-[60px] md:min-w-[68px] rounded-lg bg-gray-800 px-3 py-2 text-center text-2xl md:text-3xl font-bold leading-none shadow-inner">
                      {String(seg.value).padStart(2, "0")}
                    </div>
                    <span className="mt-1 text-[10px] uppercase tracking-wider text-gray-500">
                      {seg.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Campaign has ended.</p>
            )}

            {selected && (
              <p className="mt-4 text-center text-xs text-gray-500">
                {parseYMD(selected.start_date).toLocaleDateString("id-ID")} —{" "}
                {parseYMD(selected.end_date).toLocaleDateString("id-ID")}
              </p>
            )}
          </div>

          {/* COUPON */}
          <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-5 backdrop-blur-sm shadow-lg">
            <div className="mb-3 flex items-center gap-2 text-gray-300">
              <Tag className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Coupon Code
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-lg bg-gray-800 px-4 py-2 font-mono text-lg font-bold tracking-wider text-white select-all">
                {code}
              </span>
              <button
                onClick={onCopy}
                className={clsx(
                  "inline-flex items-center gap-2 rounded-lg border",
                  "border-gray-600 bg-gray-700 px-4 py-2 text-sm font-semibold text-white",
                  "transition-colors hover:bg-gray-600 hover:border-gray-500",
                  { "bg-black border-black": copied }
                )}
                aria-label="Copy coupon code"
                disabled={!selected}
              >
                <Zap className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Apply at checkout. Terms & conditions apply.
            </p>
          </div>

          {/* PROGRESS */}
          <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-5 backdrop-blur-sm shadow-lg">
            <div className="mb-3 flex items-center gap-2 text-gray-300">
              <Sparkles className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Limited Stock
              </span>
            </div>
            <div className="relative h-10 overflow-hidden rounded-lg border border-gray-600 bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-gray-500 to-gray-400"
                style={{ width: `${safePercent}%` }}
                aria-hidden
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                {safePercent}% Claimed
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              {usageLimit
                ? `Used ${usedCount} of ${usageLimit} vouchers`
                : `Hurry! Offers are selling out fast.`}
            </p>
          </div>
        </div>

        {/* PERKS */}
        <div className="mt-12 grid grid-cols-1 gap-4 text-gray-300 sm:grid-cols-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium uppercase tracking-wide">
              30-Day Guarantee
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-3">
            <Truck className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Worldwide Shipping
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-3">
            <Headphones className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium uppercase tracking-wide">
              24/7 Support
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/product?campaign=voucher"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-bold text-black transition hover:bg-gray-200 uppercase tracking-wide shadow-lg"
          >
            Shop Now
          </Link>
          <Link
            href="/how-to-order"
            className="inline-flex items-center justify-center rounded-lg border border-gray-600 bg-transparent px-8 py-3 text-base font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white uppercase tracking-wide"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}