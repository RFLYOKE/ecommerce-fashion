import Link from "next/link";

const IMG =
  "https://i.pinimg.com/1200x/dc/28/77/dc2877f08ba923ba34c8fa70bae94128.jpg";

type Product = {
  id: string;
  name: string;
  price: number;
  href: string;
  image?: string;
};

const CURRENCY = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    n
  );

const SAMPLE: Product[] = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i + 1),
  name: `New Arrival ${i + 1}`,
  price: 249000 + i * 10000,
  href: `/product/${i + 1}`,
  image: IMG,
}));

export default function NewArrival({ items = SAMPLE }: { items?: Product[] }) {
  return (
    <section className="mx-auto  px-4 py-10 md:py-14">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            New Arrival
          </h2>
          <p className="text-sm text-gray-500">
            Rilis terbaru — jangan sampai kehabisan.
          </p>
        </div>
        <Link
          href="/product?sort=new"
          className="rounded-full bg-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-rose-700"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((p) => (
          <Link
            key={p.id}
            href={p.href}
            className="group overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm ring-1 ring-rose-100 transition hover:shadow-md"
          >
            <div className="relative">
              <img
                src={p.image ?? IMG}
                alt={p.name}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 ring-1 ring-rose-200">
                New
              </span>
            </div>
            <div className="p-4">
              <h3 className="line-clamp-1 font-semibold text-gray-900">
                {p.name}
              </h3>
              <p className="mt-1 text-rose-700 font-bold">
                {CURRENCY(p.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}