import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MotifSprite from "@/components/MotifSprite";
import Announcement from "@/components/Announcement";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bloom Nook — луковицы цветов с доставкой через Ozon",
  description:
    "Отборный посадочный материал тюльпанов, нарциссов, гиацинтов и лилий. Заказ и доставка — через Ozon, удобно и безопасно.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <MotifSprite />
        <AuthProvider>
          <CartProvider>
            <div style={{ background: "#fff", minHeight: "100vh" }}>
              <Announcement />
              <Header />
              {children}
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
