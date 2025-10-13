// components/sections/ProductCategories.tsx
import Link from "next/link";

const IMG =
  "https://i.pinimg.com/1200x/dc/28/77/dc2877f08ba923ba34c8fa70bae94128.jpg";

type Category = { label: string; slug: string };

const CATS: Category[] = [
  { label: "footwear & socks", slug: "footwear-socks" },
  { label: "jackeg & vest", slug: "jacket-vest" }, // mengikuti nama yang kamu berikan
  { label: "hodie & crewneck", slug: "hoodie-crewneck" },
  { label: "long pants", slug: "long-pants" },
  { label: "short pants", slug: "short-pants" },
  { label: "bagpack", slug: "backpack" },
  { label: "duffle bag & sling bag", slug: "duffle-sling" },
  { label: "cap", slug: "cap" },
  { label: "tshirt", slug: "tshirt" },
  { label: "shirts", slug: "shirts" },
  { label: "all women", slug: "all-women" },
];

export default function ProductCategories({
  categories = CATS,
}: {
  categories?: Category[];
}) {
  return (
    <section className="mx-auto   px-4 py-10 md:py-14">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
        Produk Kategori
      </h2>
      <p className="text-sm text-gray-500">
        Pilih kategori untuk mulai belanja.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/product?category=${encodeURIComponent(c.slug)}`}
            className="group relative overflow-hidden rounded-2xl ring-1 ring-rose-100 transition hover:shadow-md"
          >
            <img
              src={IMG}
              alt={c.label}
              className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-rose-800/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="rounded-lg bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 ring-1 ring-rose-200">
                {c.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
