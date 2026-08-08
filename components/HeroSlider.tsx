"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import heroGarden from "@/public/hero-garden.jpg";
import heroPacking from "@/public/hero-packing.jpg";
import heroStorage from "@/public/hero-storage.jpg";

const SLIDES: { src: StaticImageData; alt: string }[] = [
  { src: heroGarden, alt: "Клумба с тюльпанами, нарциссами и мускари, выращенными из наших луковиц" },
  { src: heroPacking, alt: "Ручная упаковка луковиц тюльпанов в фирменные коробки Bloom Nook" },
  { src: heroStorage, alt: "Луковицы тюльпанов в холодильной камере на складе Bloom Nook" },
];

const INTERVAL_MS = 5000;

/**
 * Слайдер фотографий в hero-блоке главной. Кроссфейд с автопрокруткой,
 * точки-переключатели и свайп на тач-экранах. Первый кадр рендерится
 * статически при сборке (LCP и индексация), остальные подгружаются браузером.
 */
export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  // Автопрокрутка. Эффект пересоздаётся при смене кадра, поэтому после
  // ручного переключения отсчёт паузы начинается заново.
  useEffect(() => {
    const t = window.setInterval(() => setActive((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [active]);

  return (
    <div
      style={{ position: "absolute", inset: 0 }}
      role="group"
      aria-roledescription="Слайдер"
      aria-label="Фотографии Bloom Nook"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) < 40) return;
        setActive((i) => (i + (dx < 0 ? 1 : SLIDES.length - 1)) % SLIDES.length);
      }}
    >
      {SLIDES.map((s, i) => (
        <Image
          key={s.alt}
          src={s.src}
          alt={s.alt}
          fill
          sizes="(max-width: 900px) 340px, 50vw"
          style={{
            objectFit: "cover",
            opacity: i === active ? 1 : 0,
            transition: "opacity .9s ease",
          }}
          priority={i === 0}
        />
      ))}

      {/* точки-переключатели */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 8,
          zIndex: 1,
        }}
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.alt}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Фото ${i + 1} из ${SLIDES.length}`}
            aria-current={i === active}
            style={{
              width: i === active ? 22 : 8,
              height: 8,
              borderRadius: 999,
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: i === active ? "#fff" : "rgba(255,255,255,.55)",
              boxShadow: "0 1px 4px rgba(24,53,18,.35)",
              transition: "width .3s ease, background .3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
