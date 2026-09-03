"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

/** Номер счётчика Яндекс.Метрики (аккаунт владельца, metrika.yandex.ru). */
const METRIKA_ID = 112269985;

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

/**
 * Счётчик Яндекс.Метрики: вебвизор, карта кликов, точный отказ.
 *
 * Next.js переключает страницы без перезагрузки (SPA), поэтому Метрика сама
 * видит только первый просмотр визита — об остальных переходах сообщаем
 * вручную через ym('hit') при смене пути. Путь отслеживаем через usePathname
 * (не useSearchParams — тот при статической сборке вырезал бы разметку до
 * границы Suspense из прегенерированного HTML).
 */
export default function YandexMetrika() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false; // первый просмотр засчитывает init
      return;
    }
    window.ym?.(METRIKA_ID, "hit", window.location.href);
  }, [pathname]);

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${METRIKA_ID}, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
          });
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
