"use client";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Footer from "@/components/footer/footer";
import TopHeader from "@/components/header/top-header";
import CartSidebar from "@/components/main/product-page/cart-sidebar";
import ScrollToTopButton from "@/components/ui/scroll-top-button";
import useCart from "@/hooks/use-cart";
import clsx from "clsx";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, close, cartItems, removeItem } = useCart();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isWisataPage = pathname === "/wisata" || pathname === "/profile";

  return (
    <LanguageProvider>
      <div className="w-full bg-white">
        {!isLoginPage && (
          <header className="sticky top-0 z-50">
            <TopHeader />
          </header>
        )}

        {/* Padding-top untuk menghindari content ketutupan header saat fixed */}
        <main className={clsx(!isLoginPage && isWisataPage && "pt-20")}>
          {children}
        </main>

        {/* Pass all necessary props to CartSidebar */}
        <CartSidebar
          isOpen={isOpen}
          onClose={close}
          items={cartItems} // Changed from 'cartItems' to 'items'
          onRemove={removeItem}
        />

        {!isLoginPage && (
          <>
            <ScrollToTopButton />
            <Footer />
          </>
        )}
      </div>
    </LanguageProvider>
  );
}
