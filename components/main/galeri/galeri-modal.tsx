import Image from "next/image";
import { GaleriItem } from "./galeri-list";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: GaleriItem | null;
};

export default function GaleriModal({ isOpen, onClose, item }: Props) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
        >
          ✕
        </button>
        <div className="relative w-full h-64 mb-4">
          <Image
            src={item.image}
            alt={item.title}
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
        <p className="text-gray-600">{item.description}</p>
      </div>
    </div>
  );
}