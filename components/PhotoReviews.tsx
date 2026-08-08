/**
 * Отзывы покупателей с маркетплейса: скриншот отзыва + фото цветов покупателя,
 * «прикреплённое» к правому нижнему углу скриншота (там у всех скриншотов
 * пустая зона, поэтому текст отзыва не перекрывается). Статичные картинки из
 * public/reviews — три отзыва, макет: скриншоты ~1170×300–370, фото 3:4.
 */

interface PhotoReview {
  shot: string; // скриншот отзыва
  photo: string; // фото цветов покупателя
  alt: string;
  photoAlt: string; // alt фото цветов — индексируется поиском по картинкам
}

const REVIEWS: PhotoReview[] = [
  {
    shot: "/reviews/review-1.png",
    photo: "/reviews/flowers-1.jpg",
    alt: "Отзыв Елены о нарциссах: посадила осенью, всё взошло — с фото букета жёлтых нарциссов",
    photoAlt: "Букет жёлтых нарциссов, выращенных из луковиц Bloom Nook — фото покупателя",
  },
  {
    shot: "/reviews/review-2.png",
    photo: "/reviews/flowers-2.jpg",
    alt: "Отзыв Марины о белых лилиях: высоченные, цветы огромные — с фото белых лилий в палисаднике",
    photoAlt: "Белые лилии в палисаднике, выращенные из луковиц Bloom Nook — фото покупателя",
  },
  {
    shot: "/reviews/review-3.png",
    photo: "/reviews/flowers-3.jpg",
    alt: "Отзыв Марии о тюльпанах: отличные луковицы, выросли красивые тюльпаны — с фото сиреневых тюльпанов",
    photoAlt: "Сиреневые тюльпаны на клумбе, выращенные из луковиц Bloom Nook — фото покупателя",
  },
];

/** Лёгкий разнобой поворота фото, чтобы карточки выглядели «живыми». */
const TILTS = [2.5, -2, 2];

export default function PhotoReviews() {
  return (
    // Обычный блочный поток (не flex): проценты ширин у картинок считаются от
    // контейнера, и на узких экранах ничего не распирает вширь.
    <div style={{ maxWidth: 980, margin: "0 auto" }}>
      {/* Небольшая пометка-источник: отзывы с Wildberries */}
      <div style={{ textAlign: "center", marginBottom: 34 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "100%",
            gap: 8,
            border: "1px solid var(--line)",
            borderRadius: 999,
            padding: "8px 16px",
            background: "#fff",
            fontSize: 13.5,
            fontWeight: 600,
            color: "var(--muted)",
          }}
        >
          Реальные отзывы покупателей на
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/reviews/wb-logo.svg" alt="Wildberries" style={{ height: 13, display: "block" }} />
        </span>
      </div>
      {REVIEWS.map((r, i) => (
        // paddingBottom резервирует место под свисающее ниже карточки фото;
        // скриншот уже контейнера, чтобы фото лишь чуть касалось его правого
        // края (звёзды, дата и текст отзыва остаются полностью видимыми).
        <div key={r.shot} style={{ position: "relative", paddingBottom: 100, marginBottom: 44 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={r.shot}
            alt={r.alt}
            loading="lazy"
            style={{
              display: "block",
              width: "calc(100% - 110px)",
              height: "auto",
              borderRadius: 18,
              border: "1px solid var(--line)",
              boxShadow: "0 10px 30px rgba(24,53,18,.08)",
              background: "#fff",
            }}
          />
          {/* Фото цветов покупателя — «прикреплено» к правому нижнему углу отзыва */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={r.photo}
            alt={r.photoAlt}
            loading="lazy"
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "clamp(110px, 16vw, 160px)",
              aspectRatio: "3 / 4",
              objectFit: "cover",
              borderRadius: 14,
              border: "5px solid #fff",
              boxShadow: "0 14px 34px rgba(24,53,18,.22)",
              transform: `rotate(${TILTS[i % TILTS.length]}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
