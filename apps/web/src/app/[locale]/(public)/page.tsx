import { HOME_PAGE_COPY } from "../../../constants/site.constants";

export default function PublicHomePage() {
  return (
    <section className="foundation-panel" aria-labelledby="foundation-title">
      <p className="foundation-panel__eyebrow">{HOME_PAGE_COPY.eyebrow}</p>
      <h1 id="foundation-title" className="foundation-panel__title">
        {HOME_PAGE_COPY.title}
      </h1>
      <p className="foundation-panel__text">{HOME_PAGE_COPY.text}</p>
    </section>
  );
}
