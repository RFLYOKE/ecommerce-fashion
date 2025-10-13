import Image from "next/image";
import { beritaList } from "./data";
import { Berita } from "@/types/berita";

type PopularNewsProps = {
  onClick?: (berita: Berita) => void;
};

export default function PopularNews({ onClick }: PopularNewsProps) {
  const popular = beritaList.filter((item) => item.isPopular);

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h3 className="text-xl font-bold mb-4 text-green-600">Populer</h3>
      <ul className="space-y-3">
        {popular.map((item, i) => (
          <li
            key={item.id}
            onClick={() => onClick?.(item)}
            className="flex items-start gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
          >
            <div className="relative w-16 h-12 flex-shrink-0 rounded overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-700 hover:underline line-clamp-2">
              {i + 1}. {item.title}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}