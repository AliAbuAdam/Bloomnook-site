import type { Metadata, Viewport } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import MotifSprite from "@/components/MotifSprite";
import Announcement from "@/components/Announcement";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
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
    <html lang="ru" className={`${playfair.variable} ${manrope.variable}`}>
      <body>
        <MotifSprite />
        <div style={{ background: "#fff", minHeight: "100vh" }}>
          <Announcement />
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
