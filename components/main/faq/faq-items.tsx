"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface FaqItemsProps {
  faqs: {
    question: string;
    answer: string;
  }[];
}

const FaqItems: React.FC<FaqItemsProps> = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3 p-4">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden bg-[#6B6B6B] text-white"
        >
          <button
            className="w-full flex justify-between items-center text-left p-4 hover:bg-white/20 transition-colors"
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
          >
            <span className="font-medium text-sm pr-2">{faq.question}</span>
            <div className="flex-shrink-0">
              {activeIndex === i ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>
          {activeIndex === i && (
            <div className="px-4 pb-4">
              <p className="text-sm leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqItems;
