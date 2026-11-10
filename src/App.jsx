import { useEffect, useRef, useState } from "react";
import "./App.css";

const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
const ARTWORK = `${import.meta.env.BASE_URL}wedding-art.jpg`;

/*
  CHANGE YOUR EVENT DETAILS HERE.

  Dates and times below preserve your supplied information.

  Check before sharing:
  - 29 January 2026 is Thursday.
  - 30 January 2026 is Friday.
  - Friday/Saturday would match January 2027.
  - Confirm Engagement: 05:00 AM or PM.
  - Confirm Nikah: 11:30 PM or AM, since lunch follows.

  Put exact Google Maps HTTPS links in mapUrl.
  If blank, the website searches Google Maps using the address.
*/

const EVENTS = [
  {
    id: "haldi",
    name: "Haldi",
    subtitle: "A little golden happiness",
    date: "2026-01-29",
    time: "04:00 PM",
    venue: "Mohammad Paradise Building, Dapoli Khonda",
    mapUrl: "",
    blessing:
      "Your presence will bring warmth to our Haldi celebration. May Allah fill these moments with happiness and barakah.",
  },
  {
    id: "mehendi",
    name: "Mehendi",
    subtitle: "Love, in every little detail",
    date: "2026-01-30",
    time: "09:00 AM",
    venue: "Mohammad Paradise Building, Dapoli Khonda",
    mapUrl: "",
    blessing:
      "As the colours of Mehendi deepen, join us with your love and duas for a beautiful new beginning.",
  },
  {
    id: "engagement",
    name: "Engagement",
    subtitle: "The promise of togetherness",
    date: "2026-01-30",
    time: "05:00 AM",
    venue: "Mohammad Paradise Building, Dapoli Khonda",
    mapUrl: "",
    blessing:
      "Your kind wishes will make this promise even more meaningful. May Allah guide our journey with grace.",
  },
  {
    id: "nikah",
    name: "Nikah",
    subtitle: "A beautiful, sacred promise",
    date: "2027-01-31",
    time: "11:30 PM",
    meal: "Lunch thereafter",
    venue: "Shiv Budruk, Taluka Khed",
    mapUrl: "",
    blessing:
      "Your gracious presence and heartfelt duas will make our Nikah truly special. May Allah unite us in goodness.",
  },
];

function Monogram() {
  return (
    <span className="monogram" aria-hidden="true">
      R<i>&</i>M
    </span>
  );
}

function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span />
      ✧
      <span />
    </div>
  );
}

function Artwork({ className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      className={className}
      src={ARTWORK}
      alt=""
      onError={() => setFailed(true)}
    />
  );
}

function Reveal({ children, className = "" }) {
  const element = useRef(null);

  useEffect(() => {
    const node = element.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      node.classList.add("visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={element} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function FloatingLights() {
  return (
    <div className="floating-lights" aria-hidden="true">
      {Array.from({ length: 22 }, (_, index) => (
        <span
          key={index}
          style={{
            "--left": `${(index * 29 + 7) % 100}%`,
            "--delay": `${-(index % 12)}s`,
            "--duration": `${12 + (index % 7)}s`,
            "--size": `${2 + (index % 3)}px`,
          }}
        />
      ))}
    </div>
  );
}

function Envelope({ onOpen, focusOnMount }) {
  const [opening, setOpening] = useState(false);
  const timer = useRef(null);
  const button = useRef(null);

  useEffect(() => {
    if (focusOnMount) {
      button.current?.focus({ preventScroll: true });
    }

    return () => window.clearTimeout(timer.current);
  }, [focusOnMount]);

  function openEnvelope() {
    if (opening) return;

    setOpening(true);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    timer.current = window.setTimeout(
      onOpen,
      reducedMotion ? 0 : 1800
    );
  }

  return (
    <section
      className={`cover ${opening ? "opening" : ""}`}
      aria-label="Open the wedding invitation"
    >
      <Artwork className="cover-art" />
      <div className="cover-overlay" />
      <div className="outer-border" />
      <FloatingLights />

      <header className="cover-header">
        <p className="arabic" lang="ar" dir="rtl">
          {BISMILLAH}
        </p>

        <p className="eyebrow">
          With the blessings of Allah
        </p>
      </header>

      <div className="cover-content">
        <p className="eyebrow gold">
          A little envelope. A beautiful beginning.
        </p>

        <h1>
          Rahil <em>&</em> Muskan
        </h1>

        <p className="cover-subtitle">
          An invitation, wrapped in love and duas.
        </p>

        <button
          ref={button}
          type="button"
          className="envelope"
          onClick={openEnvelope}
          disabled={opening}
          aria-label="Open Rahil and Muskan's wedding invitation"
        >
          <span className="envelope-back" />

          <span className="envelope-letter">
            <span className="eyebrow">
              Together, by His grace
            </span>

            <span className="letter-names">
              Rahil & Muskan
            </span>

            <span className="letter-line" />

            <span className="letter-note">
              You are warmly invited
            </span>
          </span>

          <span className="envelope-front" />
          <span className="envelope-flap" />

          <span className="wax-seal">
            <Monogram />
          </span>

          <span className="corner corner-left" />
          <span className="corner corner-right" />
        </button>

        <p className="open-prompt" aria-live="polite">
          <span />

          {opening
            ? "Unfolding a beautiful beginning…"
            : "Touch the seal to open"}

          <span />
        </p>
      </div>

      <p className="cover-footer">
        The Karbelkar & Tickley families
      </p>
    </section>
  );
}

function getMapLink(event) {
  const fallback =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(event.venue);

  if (!event.mapUrl) return fallback;

  try {
    const url = new URL(event.mapUrl);
    return url.protocol === "https:" ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function EventCard({ event, index }) {
  const date = new Date(`${event.date}T12:00:00`);

  const weekday = date.toLocaleDateString("en-GB", {
    weekday: "long",
  });

  const month = date.toLocaleDateString("en-GB", {
    month: "long",
  });

  return (
    <article
      className={`event-card ${event.id}`}
      aria-labelledby={`event-title-${event.id}`}
    >
      <div className="event-top">
        <span className="event-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="event-category">
          {event.id === "nikah"
            ? "The wedding"
            : "The celebrations"}
        </span>

        <span aria-hidden="true">✧</span>
      </div>

      <p className="card-bismillah" lang="ar" dir="rtl">
        {BISMILLAH}
      </p>

      <div className="event-title">
        <p>{event.subtitle}</p>
        <h3 id={`event-title-${event.id}`}>
          {event.name}
        </h3>
      </div>

      <time className="event-date" dateTime={event.date}>
        <span className="date-number">
          {date.getDate()}
        </span>

        <span>
          <strong>
            {month} {date.getFullYear()}
          </strong>
          <small>{weekday}</small>
        </span>
      </time>

      <p className="event-time">
        {event.time}
        {event.meal && <em> · {event.meal}</em>}
      </p>

      <div className="venue">
        <span className="eyebrow">The venue</span>
        <p>{event.venue}</p>
      </div>

      <a
        className="map-button"
        href={getMapLink(event)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Find the ${event.name} venue on Google Maps`}
      >
        {event.mapUrl
          ? "View location"
          : "Find venue on Google Maps"}

        <span aria-hidden="true">↗</span>
      </a>

      <p className="event-blessing">
        {event.blessing}
      </p>
    </article>
  );
}

function EventStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("forward");

  const activeEvent = EVENTS[activeIndex];

  function selectCard(nextIndex) {
    if (
      nextIndex === activeIndex ||
      nextIndex < 0 ||
      nextIndex >= EVENTS.length
    ) {
      return;
    }

    setDirection(
      nextIndex > activeIndex ? "forward" : "backward"
    );

    setActiveIndex(nextIndex);
  }

  function nextCard() {
    selectCard(activeIndex + 1);
  }

  function previousCard() {
    selectCard(activeIndex - 1);
  }

  function handleCardClick(event) {
    // Keep Maps links and other controls independent.
    if (event.target.closest("a, button, input, select, textarea")) {
      return;
    }

    // Do not switch cards when someone selects text.
    if (window.getSelection()?.toString()) return;

    nextCard();
  }

  return (
    <div className="wedding-stack">
      <div className="stack-introduction">
        <span className="stack-symbol" aria-hidden="true">
          ✧
        </span>

        <p className="eyebrow">
          Four moments. One beautiful beginning.
        </p>

        <p className="stack-instruction">
          Choose a celebration to unfold its invitation.
        </p>
      </div>

      <div
        className="event-choices"
        role="group"
        aria-label="Choose a celebration"
      >
        {EVENTS.map((event, index) => (
          <button
            key={event.id}
            type="button"
            className={`event-choice ${
              index === activeIndex ? "selected" : ""
            }`}
            onClick={() => selectCard(index)}
            aria-pressed={index === activeIndex}
            aria-controls="selected-event-card"
          >
            <span className="choice-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span>{event.name}</span>

            <span className="choice-star" aria-hidden="true">
              ✧
            </span>
          </button>
        ))}
      </div>

      <div className="stack-stage">
        <div
          className="stack-paper paper-three"
          aria-hidden="true"
        />
        <div
          className="stack-paper paper-two"
          aria-hidden="true"
        />
        <div
          className="stack-paper paper-one"
          aria-hidden="true"
        />

        <div
          className="stack-card-holder"
          id="selected-event-card"
        >
          <div
            key={activeEvent.id}
            className={`stack-card-motion ${direction}`}
            onClick={handleCardClick}
          >
            <EventCard
              event={activeEvent}
              index={activeIndex}
            />
          </div>
        </div>
      </div>

      <div className="stack-navigation">
        <button
          type="button"
          className="stack-nav-button previous"
          onClick={previousCard}
          disabled={activeIndex === 0}
          aria-label="Show previous celebration"
        >
          <span aria-hidden="true">←</span>
          Previous
        </button>

        <div
          className="stack-counter"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <strong>{activeEvent.name}</strong>

          <span>
            {String(activeIndex + 1).padStart(2, "0")}
            <i />
            {String(EVENTS.length).padStart(2, "0")}
          </span>
        </div>

        <button
          type="button"
          className="stack-nav-button next"
          onClick={nextCard}
          disabled={activeIndex === EVENTS.length - 1}
          aria-label="Show next celebration"
        >
          Next card
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p className="stack-bottom-note">
        {activeIndex < EVENTS.length - 1
          ? "You can also tap the invitation to reveal the next card."
          : "With love, blessings and heartfelt duas. Ameen."}
      </p>
    </div>
  );
}

function Invitation({ onReplay }) {
  const heading = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="invitation">
      <nav
        className="navigation"
        aria-label="Invitation navigation"
      >
        <a href="#home" aria-label="Back to the invitation">
          <Monogram />
        </a>

        <span className="eyebrow navigation-caption">
          A celebration of love & duas
        </span>

        <a
          className="navigation-link"
          href="#celebrations"
        >
          The celebrations
          <span aria-hidden="true">↓</span>
        </a>
      </nav>

      <section className="hero" id="home">
        <div className="hero-frame">
          <Artwork className="hero-art" />
          <div className="hero-overlay" />

          <div className="hero-content">
            <p className="arabic" lang="ar" dir="rtl">
              {BISMILLAH}
            </p>

            <p className="translation">
              In the name of Allah,
              <br />
              the Most Beneficent and Merciful
            </p>

            <Divider />

            <p className="invitation-text">
              Together with their families
              <br />
              we joyfully invite you to the Nikah ceremony of
            </p>

            <h1 ref={heading} tabIndex={-1}>
              Rahil <em>&</em> Muskan
            </h1>

            <p className="hero-quote">
              A love written by Him.
            </p>

            <a className="scroll-link" href="#families">
              Unfold our invitation
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section className="families" id="families">
        <Reveal>
          <p className="eyebrow section-label">
            Two hearts, two families
          </p>

          <h2>A beautiful beginning</h2>

          <div className="family-grid">
            <div>
              <span className="eyebrow section-label">
                The groom
              </span>

              <h3>Rahil</h3>
              <p className="full-name">Inayat Karbelkar</p>
              <p className="relationship">Beloved son of</p>

              <p className="parents">
                Inayat Ali Karbelkar
                <br />
                <em>&</em> Amina Inayat Karbelkar
              </p>
            </div>

            <div
              className="family-ampersand"
              aria-hidden="true"
            >
              <span />
              <em>&</em>
              <span />
            </div>

            <div>
              <span className="eyebrow section-label">
                The bride
              </span>

              <h3>Muskan</h3>
              <p className="full-name">Mustufa Tickley</p>
              <p className="relationship">
                Beloved daughter of
              </p>

              <p className="parents">
                Mustufa Shaikh Ahmad Tickley
                <br />
                <em>&</em> Kaisar Mustufa Tickley
              </p>
            </div>
          </div>

          <Divider />

          <p className="family-note">
            With your presence, our happiness becomes complete.
          </p>
        </Reveal>
      </section>

      <section
        className="celebrations"
        id="celebrations"
      >
        <div className="celebrations-heading">
          <Reveal>
            <p className="eyebrow section-label">
              With love and the blessings of Allah
            </p>
            <h2>Our celebrations</h2>
          </Reveal>

          <Reveal>
            <p className="celebrations-description">
              Each invitation holds a special moment.
              <br />
              Unfold them, one by one.
            </p>
          </Reveal>
        </div>

        <EventStack />
      </section>

      <section className="blessing-section">
        <Artwork className="blessing-art" />

        <Reveal>
          <p className="eyebrow gold">
            A prayer for our beginning
          </p>

          <Divider />

          <blockquote>
            May Allah bless this union
            <br />
            with love, mercy and a lifetime
            <br />
            of togetherness.
          </blockquote>

          <p className="ameen">Ameen.</p>

          <p className="closing-note">
            Your presence is our joy. Your duas are our treasure.
          </p>
        </Reveal>
      </section>

      <footer className="footer">
        <Monogram />

        <p>
          With love, the Karbelkar & Tickley families
        </p>

        <button type="button" onClick={onReplay}>
          ↺ Experience the invitation again
        </button>
      </footer>
    </main>
  );
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  function openInvitation() {
    setHasOpened(true);
    setIsOpen(true);
  }

  function replay() {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return isOpen ? (
    <Invitation onReplay={replay} />
  ) : (
    <Envelope
      onOpen={openInvitation}
      focusOnMount={hasOpened}
    />
  );
}