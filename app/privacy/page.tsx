import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Bloom Nook",
  description:
    "Политика в отношении обработки персональных данных интернет-магазина Bloom Nook: какие данные собираются, цели обработки, хранение и порядок отзыва согласия.",
};

/** Оператор персональных данных (реквизиты продавца). */
const OPERATOR = {
  name: "ИП Ахмедов Санан Имамгулу оглы",
  ogrnip: "324508100295959",
  inn: "504108091325",
  address: "МО, г. Реутов, ул. Носовихинское шоссе, д. 8, кв. 8",
  email: "bloomnook.mng@gmail.com",
};

const sectionTitle: React.CSSProperties = { fontSize: 21, fontWeight: 600, margin: "36px 0 14px" };
const paragraph: React.CSSProperties = { margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.75, color: "#42503f" };
const listStyle: React.CSSProperties = { margin: "0 0 14px", paddingLeft: 22, fontSize: 15.5, lineHeight: 1.8, color: "#42503f" };

export default function PrivacyPage() {
  return (
    <main>
      <div style={{ background: "var(--sage-2)", borderBottom: "1px solid var(--line)" }}>
        <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px", textAlign: "center" }}>
          <h1 className="bn-h" style={{ fontSize: "clamp(28px, 5.5vw, 44px)", fontWeight: 600, margin: 0 }}>
            Политика конфиденциальности
          </h1>
          <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 10 }}>
            <Link href="/" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
              Главная
            </Link>{" "}
            /&nbsp; <span style={{ color: "var(--ink)" }}>Политика конфиденциальности</span>
          </div>
        </div>
      </div>

      <div className="bn-pad" style={{ maxWidth: 820, margin: "0 auto", padding: "48px 32px 80px" }}>
        <p style={{ ...paragraph, color: "var(--muted)" }}>
          Настоящая Политика определяет порядок обработки и защиты персональных данных пользователей
          интернет-магазина Bloom Nook (далее — «Сайт») и разработана в соответствии с Федеральным законом
          от 27.07.2006 № 152-ФЗ «О персональных данных». Используя Сайт и оставляя свои данные, пользователь
          подтверждает согласие с условиями настоящей Политики.
        </p>

        <h2 className="bn-h" style={sectionTitle}>
          1. Оператор персональных данных
        </h2>
        <p style={paragraph}>Обработку персональных данных осуществляет:</p>
        <ul style={listStyle}>
          <li>Наименование: {OPERATOR.name}</li>
          <li>ОГРНИП: {OPERATOR.ogrnip}</li>
          <li>ИНН: {OPERATOR.inn}</li>
          <li>Юридический и почтовый адрес: {OPERATOR.address}</li>
          <li>
            Адрес электронной почты:{" "}
            <a href={`mailto:${OPERATOR.email}`} style={{ color: "var(--green-3)", fontWeight: 600, textDecoration: "none" }}>
              {OPERATOR.email}
            </a>
          </li>
        </ul>

        <h2 className="bn-h" style={sectionTitle}>
          2. Цели обработки персональных данных
        </h2>
        <p style={paragraph}>Персональные данные обрабатываются в следующих целях:</p>
        <ul style={listStyle}>
          <li>регистрация и авторизация пользователя на сайте;</li>
          <li>оформление, обработка и доставка заказов;</li>
          <li>осуществление обратной связи с клиентом по вопросам работы интернет-магазина.</li>
        </ul>

        <h2 className="bn-h" style={sectionTitle}>
          3. Какие данные собираются
        </h2>
        <p style={paragraph}>Оператор обрабатывает следующие персональные данные, предоставленные пользователем:</p>
        <ul style={listStyle}>
          <li>фамилия, имя, отчество;</li>
          <li>номер телефона;</li>
          <li>адрес электронной почты;</li>
          <li>адрес и город доставки.</li>
        </ul>
        <p style={paragraph}>
          Кроме того, при использовании Сайта автоматически собираются технические данные: файлы cookie,
          IP-адрес, сведения о браузере и устройстве. Они необходимы для корректной работы Сайта — в частности,
          для сохранения содержимого корзины и сессии авторизации в личном кабинете.
        </p>

        <h2 className="bn-h" style={sectionTitle}>
          4. Где и как хранятся данные
        </h2>
        <p style={paragraph}>
          Оператор обеспечивает конфиденциальность персональных данных и принимает необходимые
          организационные и технические меры для их защиты от неправомерного доступа, уничтожения,
          изменения и распространения. Базы данных, содержащие персональные данные граждан Российской
          Федерации, находятся на серверах, расположенных на территории Российской Федерации.
        </p>
        <p style={paragraph}>
          Персональные данные не передаются третьим лицам, за исключением случаев, необходимых для исполнения
          заказа (например, службам доставки), а также случаев, предусмотренных законодательством РФ.
        </p>

        <h2 className="bn-h" style={sectionTitle}>
          5. Файлы cookie
        </h2>
        <p style={paragraph}>
          Файлы cookie относятся к персональным данным. Сайт использует их автоматически для обеспечения
          работы корзины, сохранения сессии авторизации и улучшения пользовательского опыта. Пользователь
          может отключить cookie в настройках своего браузера, однако это может повлиять на корректность
          работы отдельных функций Сайта.
        </p>

        <h2 className="bn-h" style={sectionTitle}>
          6. Как отозвать согласие
        </h2>
        <p style={paragraph}>
          Пользователь может в любой момент отозвать своё согласие на обработку персональных данных, а также
          запросить их изменение или удаление, направив соответствующее письмо на электронную почту{" "}
          <a href={`mailto:${OPERATOR.email}`} style={{ color: "var(--green-3)", fontWeight: 600, textDecoration: "none" }}>
            {OPERATOR.email}
          </a>
          . После получения обращения Оператор прекратит обработку персональных данных в установленные
          законом сроки.
        </p>

        <h2 className="bn-h" style={sectionTitle}>
          7. Изменение Политики
        </h2>
        <p style={paragraph}>
          Оператор вправе вносить изменения в настоящую Политику. Актуальная редакция всегда доступна на данной
          странице. Продолжая пользоваться Сайтом после внесения изменений, пользователь соглашается с
          обновлённой редакцией Политики.
        </p>

        <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
          <Link href="/contacts" style={{ color: "var(--green-3)", fontWeight: 600, textDecoration: "none" }}>
            Контакты и реквизиты →
          </Link>
        </div>
      </div>
    </main>
  );
}
