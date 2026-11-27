import type { CaseStudy } from "../data/site";

/* Case artwork, drawn in CSS rather than shipped as screenshots: it scales
   with the card (container query units) and never pretends to be real data. */
export function CaseCover({ kind }: { kind: CaseStudy["cover"] }) {
  if (kind === "crm") return (
    <div className="cover cover--crm">
      <div className="crm-top">
        <span className="crm-dots"><i /><i /><i /></span>
        <span className="crm-path">anrotech / crm / прайс</span>
        <span className="crm-sync">sync</span>
      </div>
      <div className="crm-wrap">
        <div className="crm-side">
          <span className="on" /><span /><span /><span /><span />
        </div>
        <div className="crm-main">
          <div className="crm-search"><span>Поиск по артикулу или аналогу</span><b>⌘K</b></div>
          <div className="crm-head"><span>Артикул</span><span>Аналог</span><span>Склад</span><span>Цена</span></div>
          {[
            ["AF-1024", "MANN W 914/2", "12", "1 240"],
            ["AF-1088", "BOSCH F 026", "4", "980"],
            ["AF-2210", "MAHLE LX 1789", "28", "1 560"],
            ["AF-3041", "FILTRON AP 139", "7", "720"],
            ["AF-4117", "KNECHT AF 427", "16", "1 890"],
            ["AF-5022", "HENGST E 1234", "3", "2 140"],
          ].map((r) => (
            <div className="crm-row" key={r[0]}>
              <span>{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span><span>{r[3]} ₽</span>
            </div>
          ))}
          <span className="crm-chip">резерв · 14</span>
        </div>
      </div>
    </div>
  );

  if (kind === "shop") return (
    <div className="cover cover--shop">
      <div className="shop-top">
        <b>BIG FOOD</b><span>Каталог</span><span>Доставка</span><i className="shop-cart" />
      </div>
      <div className="shop-hero">
        <p className="shop-kicker">Минск · ежедневно</p>
        <p className="shop-title">Свежее<br />каждый день</p>
        <span className="shop-btn">В каталог</span>
      </div>
      <div className="shop-grid">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div className={`shop-p p${n}`} key={n}><i /></div>
        ))}
      </div>
    </div>
  );

  if (kind === "invite") return (
    <div className="cover cover--invite">
      <span className="inv-frame" />
      <p className="inv-kicker">MINSK · 21:00 · 18+</p>
      <p className="inv-title">GANGSTERS<br />NIGHT</p>
      <p className="inv-foot">интерактивное приглашение</p>
      <span className="inv-stamp">V</span>
    </div>
  );

  if (kind === "holly") return (
    <div className="cover cover--holly">
      <p className="holly-kicker">дипломный проект · 2026</p>
      <p className="holly-title">Holly</p>
      <div className="holly-rule" />
      <p className="holly-desc">интерфейс, вёрстка,<br />всё с нуля</p>
      <div className="holly-grid"><i /><i /><i /></div>
      <span className="holly-dot" />
    </div>
  );

  if (kind === "backoffice") return (
    <div className="cover cover--backoffice">
      <div className="bo-top">
        <b>SiteCMS</b><span>Контент</span><span>Аналитика</span><span>Настройки</span>
      </div>
      <div className="bo-tools">
        <span className="bo-search">Поиск по сайту</span>
        <span className="bo-filter">Фильтр</span>
        <span className="bo-add">+ Добавить</span>
      </div>
      <div className="bo-table">
        <div className="bo-row head"><span>Страница</span><span>Раздел</span><span>Статус</span></div>
        {[
          ["Главная", "Корень", "Опубликовано"],
          ["Каталог", "Товары", "Опубликовано"],
          ["Доставка", "Сервис", "Черновик"],
          ["Контакты", "Корень", "Опубликовано"],
          ["Акции", "Маркетинг", "Черновик"],
        ].map((r) => (
          <div className="bo-row" key={r[0]}>
            <span>{r[0]}</span><span>{r[1]}</span><span className={r[2] === "Черновик" ? "draft" : "live"}>{r[2]}</span>
          </div>
        ))}
      </div>
      <div className="bo-pager"><span>←</span><b>1</b><span>2</span><span>3</span><span>→</span></div>
    </div>
  );

  if (kind === "golden") return (
    <div className="cover cover--golden">
      <div className="golden-photo" aria-hidden="true" />
      <div className="golden-shade" aria-hidden="true" />
      <div className="golden-top">
        <b>Golden Motors</b>
        <span>Минск · Тимирязева, 46к8</span>
      </div>
      <div className="golden-main">
        <p className="golden-title">Мойка,<br />после которой<br /><em>замечают</em></p>
        <p className="golden-sub">Кузов · салон · детейлинг<br />каждый день 9:00–19:00</p>
      </div>
      <span className="golden-pill">от 26 BYN</span>
    </div>
  );

  return (
    <div className="cover cover--vitfolio">
      <div className="vf-face" aria-hidden="true"><i /><i /></div>
      <p className="vf-title">Сложные задачи,<br />простые интерфейсы.</p>
      <p className="vf-meta">design system · eye tracker · 2026</p>
    </div>
  );
}
