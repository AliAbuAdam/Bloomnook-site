import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MotifSprite from "@/components/MotifSprite";
import Announcement from "@/components/Announcement";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import YandexMetrika from "@/components/YandexMetrika";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { SITE_URL, SITE_NAME, organizationJsonLd, jsonLdScript } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bloom Nook — купить луковицы цветов с доставкой по России",
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Интернет-магазин луковиц цветов: тюльпаны, лилии, нарциссы и редкие сорта. Отборный калиброванный посадочный материал, бесплатная доставка по всей России, памятка по посадке в каждом заказе.",
  alternates: { canonical: "/" },
  // Подтверждение прав на сайт в Яндекс.Вебмастере (метатег yandex-verification).
  verification: { yandex: "d0dbd2fe2b2ea955" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ru_RU",
    url: "/",
    title: "Bloom Nook — купить луковицы цветов с доставкой по России",
    description:
      "Отборные луковицы тюльпанов, лилий, нарциссов и редких сортов с бесплатной доставкой по всей России.",
    images: [{ url: "/hero-garden.jpg" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd())} />
        <YandexMetrika />
        <MotifSprite />
        <AuthProvider>
          <CartProvider>
            <div style={{ background: "#fff", minHeight: "100vh" }}>
              <Announcement />
              <Header />
              {children}
              <Footer />
              <CookieBanner />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
