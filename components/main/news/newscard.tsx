import Image from "next/image";
import { Berita } from "@/types/berita";

type NewsCardListProps = {
  list: Berita[];
  onClick?: (berita: Berita) => void;
};

export default function NewsCardList({ list, onClick }: NewsCardListProps) {
  return (
    <div className="space-y-6">
      {list.map((item) => (
        <div
          key={item.id}
          onClick={() => onClick?.(item)}
          className="flex gap-4 cursor-pointer hover:bg-neutral-100 p-2 rounded-md transition"
        >
          <Image
            src={item.image}
            alt={item.title}
            width={120}
            height={80}
            className="rounded-md object-cover"
          />
          <div>
            <h2 className="font-semibold text-lg text-green-600 line-clamp-2">
              {item.title}
            </h2>
            <p className="text-sm text-gray-500">{item.date}</p>
            <p className="text-sm text-gray-700 line-clamp-2 mt-1">
              {item.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}