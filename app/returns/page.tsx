import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Условия возврата — Bloom Nook",
  description:
    "Условия возврата товара и рассмотрения претензий интернет-магазина Bloom Nook: статус живого посадочного материала, порядок действий при браке или пересортице, оформление возврата.",
};

const sectionTitle: React.CSSProperties = { fontSize: 21, fontWeight: 600, margin: "36px 0 14px" };
const subTitle: React.CSSProperties = { fontSize: 17, fontWeight: 700, margin: "26px 0 12px" };
const paragraph: React.CSSProperties = { margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.75, color: "#42503f" };
const listStyle: React.CSSProperties = { margin: "0 0 14px", paddingLeft: 22, fontSize: 15.5, lineHeight: 1.8, color: "#42503f" };
const link: React.CSSProperties = { color: "var(--green-3)", fontWeight: 600, textDecoration: "none" };

export default function ReturnsPage() {
  return (
    <main>
      <div style={{ background: "var(--sage-2)", borderBottom: "1px solid var(--line)" }}>
        <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px", textAlign: "center" }}>
          <h1 className="bn-h" style={{ fontSize: "clamp(28px, 5.5vw, 44px)", fontWeight: 600, margin: 0 }}>
            Условия возврата
          </h1>
          <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 10 }}>
            <Link href="/" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
              Главная
            </Link>{" "}
            /&nbsp; <span style={{ color: "var(--ink)" }}>Условия возврата</span>
          </div>
        </div>
      </div>

      <div className="bn-pad" style={{ maxWidth: 820, margin: "0 auto", padding: "48px 32px 80px" }}>
        <h2 className="bn-h" style={{ ...sectionTitle, marginTop: 0 }}>
          Условия возврата товара и рассмотрения претензий
        </h2>
        <p style={{ ...paragraph, color: "var(--muted)" }}>
          Уважаемые покупатели! Обращаем ваше внимание на юридические и логистические особенности продажи
          живого посадочного материала в нашем интернет-магазине при оформлении заказов.
        </p>

        <h2 className="bn-h" style={sectionTitle}>
          1. Законодательный статус товара
        </h2>
        <p style={paragraph}>
          В соответствии с Постановлением Правительства РФ № 2463, живые растения (включая луковицы цветов,
          клубни, семена и саженцы) надлежащего качества входят в перечень непродовольственных товаров,
          не подлежащих возврату или обмену.
        </p>
        <p style={paragraph}>
          Это означает, что если луковицы приехали здоровыми, плотными и соответствующими заказанному сорту,
          их нельзя вернуть или обменять по субъективным причинам (например: «изменились планы на посадку»,
          «не подошёл размер» или «передумал»).
        </p>

        <h2 className="bn-h" style={sectionTitle}>
          2. Особенности доставки через «OZON Доставка»
        </h2>
        <p style={paragraph}>
          Доставка всех заказов на нашем сайте осуществляется партнёрской логистической службой
          «OZON Доставка» (в пункты выдачи заказов или курьером).
        </p>
        <p style={paragraph}>
          <strong>Важно:</strong> служба доставки OZON выполняет исключительно транспортную функцию.
          Сотрудники пунктов выдачи и курьеры не уполномочены принимать возвраты живого товара, оформлять
          акты осмотра или возвратные накладные для нашего магазина.
        </p>

        <h2 className="bn-h" style={sectionTitle}>
          3. Что делать, если обнаружен брак или несоответствие?
        </h2>
        <p style={paragraph}>
          Мы проводим тщательную ручную сортировку и строго контролируем условия хранения луковиц перед
          отправкой. Тем не менее, поскольку речь идёт о живом биологическом материале, полностью исключить
          скрытые дефекты невозможно.
        </p>
        <p style={paragraph}>
          Если при получении вы обнаружили товар ненадлежащего качества (явные признаки порчи, гнили,
          глубокой плесени, делающие луковицу нежизнеспособной) либо пересортицу (приехал не тот сорт) —
          все подобные обращения рассматриваются и решаются исключительно в частном порядке через наши
          официальные каналы поддержки:{" "}
          <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" style={link}>
            Telegram
          </a>{" "}
          или{" "}
          <a href={CONTACT.yandex} target="_blank" rel="noopener noreferrer" style={link}>
            Яндекс Чат
          </a>{" "}
          — ссылки на них также указаны в шапке нашего сайта.
        </p>

        <h3 className="bn-h" style={subTitle}>
          Пошаговая инструкция для подачи обращения
        </h3>
        <ol style={listStyle}>
          <li>
            <strong>Сделайте фиксацию.</strong> Сфотографируйте или снимите на видео повреждённый товар
            (желательно сделать это непосредственно при распаковке посылки). Снимки должны быть чёткими,
            чтобы эксперт мог оценить состояние луковицы. При пересортице сфотографируйте
            маркировку/этикетку на упаковке.
          </li>
          <li>
            <strong>Напишите нам.</strong> Свяжитесь с поддержкой в{" "}
            <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" style={link}>
              Telegram
            </a>{" "}
            или{" "}
            <a href={CONTACT.yandex} target="_blank" rel="noopener noreferrer" style={link}>
              Яндекс Чате
            </a>{" "}
            (ссылки есть и в шапке сайта) в течение 3 дней с момента фактического получения посылки.
          </li>
          <li>
            <strong>Укажите данные.</strong> Сообщите номер вашего заказа, ФИО, на которые он оформлен,
            и прикрепите отснятые фото- или видеоматериалы.
          </li>
        </ol>

        <h3 className="bn-h" style={subTitle}>
          Порядок оформления физического возврата товара
        </h3>
        <p style={paragraph}>
          В случае если после рассмотрения вашего обращения службой технической поддержки будет одобрен
          физический возврат товара назад на наш склад:
        </p>
        <ul style={listStyle}>
          <li>
            возврат посылки оформляется и отправляется покупателем исключительно через логистические службы
            Почта России или СДЭК;
          </li>
          <li>
            адрес склада, данные получателя и тип отправления (до ПВЗ или до двери) менеджер поддержки
            предоставит вам в ходе диалога после одобрения заявки.
          </li>
        </ul>
        <p style={paragraph}>
          Пожалуйста, не пытайтесь отправить возврат обратно через пункты выдачи OZON — они не смогут его
          принять и обработать.
        </p>

        <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
          <Link href="/contacts" style={link}>
            Контакты и реквизиты →
          </Link>
        </div>
      </div>
    </main>
  );
}
