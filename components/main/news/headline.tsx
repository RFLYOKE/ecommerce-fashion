import Image from "next/image";
import { Berita } from "@/types/berita";

type HeadlineProps = {
  berita: Berita;
  onClick?: () => void;
};

export default function Headline({ berita, onClick }: HeadlineProps) {
  if (!berita) return null;

  return (
    <div
      onClick={onClick}
      className="mb-8 cursor-pointer hover:shadow-md transition rounded-lg"
    >
      <Image
        src={berita.image}
        alt={berita.title}
        width={1200}
        height={600}
        className="rounded-lg w-full object-cover"
      />
      <h1 className="text-3xl md:text-4xl font-bold mt-4 text-green-600">
        {berita.title}
      </h1>
      <p className="text-gray-600 mt-2 text-sm">{berita.date}</p>
      <p className="mt-4 text-base text-gray-700 line-clamp-5">
        {berita.content}
      </p>
    </div>
  );
}