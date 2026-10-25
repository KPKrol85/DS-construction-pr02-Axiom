// EXTRA-03 — focused coverage for js/components/navigation.js.
//
// The suite drives the real module through a minimal copy of the production
// header markup and asserts observable mobile and breakpoint state.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { initNavigation } from "../js/components/navigation.js";

const { window } = globalThis;

const NAVIGATION_FIXTURE = `
  <header class="site-header">
    <div class="header__inner">
      <nav id="primaryNav" class="site-nav" aria-label="Nawigacja główna">
        <ul class="site-nav__list">
          <li class="site-nav__item"><a class="site-nav__link" href="#o-nas">O nas</a></li>
          <li class="site-nav__item"><a class="site-nav__link" href="#kontakt">Kontakt</a></li>
        </ul>
      </nav>
      <button id="nav-toggle" type="button" class="nav-toggle" aria-label="Otwórz menu" aria-controls="primaryNav" aria-haspopup="true" aria-expanded="false">
        Menu
      </button>
    </div>
  </header>
  <button id="outsideControl" type="button">Poza nawigacją</button>
`;

const SECTION_IDS = ["o-nas", "uslugi", "galeria", "faq", "kontakt"];
const SECTION_BOUNDS = {
  hero: [0, 600],
  "o-nas": [600, 1100],
  uslugi: [1100, 1700],
  "testimonial-cards": [1700, 2100],
  galeria: [2100, 2700],
  faq: [2700, 3200],
  kontakt: [3200, 3800],
};
const HOMEPAGE_FIXTURE = NAVIGATION_FIXTURE.replace(
  /<ul class="site-nav__list">[\s\S]*?<\/ul>/,
  `<ul class="site-nav__list">
    <li class="site-nav__item"><a class="site-nav__link" href="index.html" aria-current="page">Strona Główna</a></li>
    ${SECTION_IDS.map((id) => `<li class="site-nav__item"><a class="site-nav__link" href="#${id}">${id}</a></li>`).join("")}
  </ul>`
) + `<main>${Object.keys(SECTION_BOUNDS).map((id) => `<section id="${id}" style="scroll-margin-top: 96px"></section>`).join("")}</main><footer></footer>`;

const trackedGlobalListeners = [];
const documentAddEventListener = document.addEventListener.bind(document);
const windowAddEventListener = globalThis.window.addEventListener.bind(globalThis.window);

let mediaQuery;
let animationFrames;

const flushNavigationFrame = () => {
  const pending = [...animationFrames.values()];
  animationFrames.clear();
  pending.forEach((callback) => callback(0));
};

const expectCurrentSection = (id = null) => {
  const markedLinks = [...document.querySelectorAll("[data-current-section]")];
  expect(markedLinks.map((link) => link.getAttribute("href"))).toEqual(id ? [`#${id}`] : []);
  markedLinks.forEach((link) => expect(link.dataset.currentSection).toBe("true"));
};

const createMediaQuery = (initialMatches) => {
  const listeners = new Set();

  return {
    matches: initialMatches,
    media: "(max-width: 899px)",
    onchange: null,
    addEventListener(type, listener) {
      if (type === "change") listeners.add(listener);
    },
    removeEventListener(type, listener) {
      if (type === "change") listeners.delete(listener);
    },
    addListener(listener) {
      listeners.add(listener);
    },
    removeListener(listener) {
      listeners.delete(listener);
    },
    dispatchEvent(event) {
      listeners.forEach((listener) => listener(event));
      return true;
    },
    setMatches(matches) {
      this.matches = matches;
      this.dispatchEvent({ matches, media: this.media });
    },
    clearListeners() {
      listeners.clear();
    },
  };
};

const mountNavigation = ({ mobile = true, homepage = false, scroll = 0, beforeInit = () => {} } = {}) => {
  document.body.className = "";
  document.body.innerHTML = homepage ? HOMEPAGE_FIXTURE : NAVIGATION_FIXTURE;
  mediaQuery = createMediaQuery(mobile);
  vi.stubGlobal("matchMedia", vi.fn(() => mediaQuery));
  vi.stubGlobal("scrollY", scroll);
  const geometry = { headerBottom: 80 };
  if (homepage) {
    vi.spyOn(document.querySelector(".site-header"), "getBoundingClientRect").mockImplementation(() => ({ bottom: geometry.headerBottom }));
    Object.entries(SECTION_BOUNDS).forEach(([id, [top, bottom]]) => {
      vi.spyOn(document.getElementById(id), "getBoundingClientRect").mockImplementation(() => ({
        top: top - window.scrollY,
        bottom: bottom - window.scrollY,
      }));
    });
  }

  vi.spyOn(document, "addEventListener").mockImplementation((type, listener, options) => {
    trackedGlobalListeners.push([document, type, listener, options]);
    documentAddEventListener(type, listener, options);
  });
  vi.spyOn(globalThis.window, "addEventListener").mockImplementation((type, listener, options) => {
    trackedGlobalListeners.push([globalThis.window, type, listener, options]);
    windowAddEventListener(type, listener, options);
  });

  beforeInit();
  initNavigation();

  return {
    button: document.querySelector("#nav-toggle"),
    nav: document.querySelector("#primaryNav"),
    firstLink: document.querySelector(".site-nav__link"),
    geometry,
    scrollToPosition(position, event = "scroll") {
      window.scrollY = position;
      window.dispatchEvent(new Event(event));
      flushNavigationFrame();
    },
  };
};

const openNavigation = () => {
  const button = document.querySelector("#nav-toggle");
  button.focus();
  button.click();
};

const pressEscape = () => {
  const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
  document.activeElement.dispatchEvent(event);
};

beforeEach(() => {
  animationFrames = new Map();
  let frameId = 0;
  vi.stubGlobal("requestAnimationFrame", vi.fn((callback) => {
    animationFrames.set(++frameId, callback);
    return frameId;
  }));
  document.body.className = "";
  document.body.innerHTML = "";
  document.documentElement.style.removeProperty("--mobile-nav-top");
  document.documentElement.style.removeProperty("--mobile-nav-max-height");
});

afterEach(() => {
  while (trackedGlobalListeners.length) {
    const [target, type, listener, options] = trackedGlobalListeners.pop();
    target.removeEventListener(type, listener, options);
  }
  mediaQuery?.clearListeners();
  mediaQuery = null;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.className = "";
  document.body.innerHTML = "";
  document.documentElement.style.removeProperty("--mobile-nav-top");
  document.documentElement.style.removeProperty("--mobile-nav-max-height");
});

describe("mobile navigation state", () => {
  it("initialises collapsed with hidden and inert navigation", () => {
    const { button, nav } = mountNavigation();

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-label")).toBe("Otwórz menu");
    expect(button.classList.contains("active")).toBe(false);
    expect(nav.classList.contains("mobile-open")).toBe(false);
    expect(nav.getAttribute("aria-hidden")).toBe("true");
    expect(nav.hasAttribute("inert")).toBe(true);
    expect(document.body.classList.contains("nav-open")).toBe(false);
  });

  it("opens through the toggle and moves focus to the first link", () => {
    const { button, nav, firstLink } = mountNavigation();

    openNavigation();

    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.getAttribute("aria-label")).toBe("Zamknij menu");
    expect(button.classList.contains("active")).toBe(true);
    expect(nav.classList.contains("mobile-open")).toBe(true);
    expect(nav.getAttribute("aria-hidden")).toBe("false");
    expect(nav.hasAttribute("inert")).toBe(false);
    expect(document.body.classList.contains("nav-open")).toBe(true);
    expect(document.activeElement).toBe(firstLink);
  });

  it("closes through the toggle and returns focus to it", () => {
    const { button, nav } = mountNavigation();
    openNavigation();

    button.click();

    expect(nav.classList.contains("mobile-open")).toBe(false);
    expect(nav.getAttribute("aria-hidden")).toBe("true");
    expect(nav.hasAttribute("inert")).toBe(true);
    expect(document.body.classList.contains("nav-open")).toBe(false);
    expect(document.activeElement).toBe(button);
  });

  it("closes with Escape and returns focus to the toggle", () => {
    const { button, nav } = mountNavigation();
    openNavigation();

    pressEscape();

    expect(nav.classList.contains("mobile-open")).toBe(false);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("closes when a navigation link is activated", () => {
    const { button, nav, firstLink } = mountNavigation();
    openNavigation();

    firstLink.click();

    expect(nav.classList.contains("mobile-open")).toBe(false);
    expect(document.body.classList.contains("nav-open")).toBe(false);
    expect(document.activeElement).toBe(button);
  });

  it("closes on a pointer interaction outside the navigation", () => {
    const { button, nav } = mountNavigation();
    openNavigation();

    document.querySelector("#outsideControl").dispatchEvent(new Event("pointerdown", { bubbles: true }));

    expect(nav.classList.contains("mobile-open")).toBe(false);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });
});

describe("navigation breakpoint synchronisation", () => {
  it("resets an open mobile menu to the visible desktop state", () => {
    const { button, nav } = mountNavigation();
    openNavigation();

    mediaQuery.setMatches(false);

    expect(nav.classList.contains("mobile-open")).toBe(false);
    expect(nav.getAttribute("aria-hidden")).toBe("false");
    expect(nav.hasAttribute("inert")).toBe(false);
    expect(button.classList.contains("active")).toBe(false);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-label")).toBe("Otwórz menu");
    expect(document.body.classList.contains("nav-open")).toBe(false);
  });
});

describe("homepage current section", () => {
  it("leaves the hero unmarked and preserves page identity and destinations", () => {
    const { nav } = mountNavigation({ homepage: true, mobile: false });
    flushNavigationFrame();

    expectCurrentSection();
    expect(nav.querySelector('[aria-current="page"]').getAttribute("href")).toBe("index.html");
    expect([...nav.querySelectorAll("a")].map((link) => link.getAttribute("href")))
      .toEqual(["index.html", ...SECTION_IDS.map((id) => `#${id}`)]);
  });

  it("initialises at the actual reading position regardless of the URL fragment", () => {
    window.history.replaceState(null, "", "/index.html#faq");
    try {
      mountNavigation({ homepage: true, scroll: 1200 });
      flushNavigationFrame();
      expectCurrentSection("uslugi");
      expect(document.querySelector('[aria-current="page"]').textContent).toBe("Strona Główna");
    } finally {
      window.history.replaceState(null, "", "/");
    }
  });

  it("tracks all five sections forward and backward, clearing untracked areas", () => {
    const { scrollToPosition } = mountNavigation({ homepage: true });
    flushNavigationFrame();
    const positions = [
      [650, "o-nas"], [1200, "uslugi"], [1800, null], [2200, "galeria"],
      [2800, "faq"], [3300, "kontakt"], [3900, null],
      [3300, "kontakt"], [2800, "faq"], [2200, "galeria"], [1800, null],
      [1200, "uslugi"], [650, "o-nas"], [0, null],
    ];
    positions.forEach(([position, id]) => {
      scrollToPosition(position);
      expectCurrentSection(id);
    });
  });

  it("uses exclusive section ends at adjacent and untracked boundaries", () => {
    const { scrollToPosition } = mountNavigation({ homepage: true });
    // The common reading line is 97px: 96px native offset plus 1px.
    [[1002, "o-nas"], [1003, "uslugi"], [1602, "uslugi"], [1603, null],
      [2003, "galeria"], [3702, "kontakt"], [3703, null]].forEach(([position, id]) => {
      scrollToPosition(position);
      expectCurrentSection(id);
    });
  });

  it("handles direct fragment entry at the existing native anchor offset", () => {
    window.history.replaceState(null, "", "/index.html#faq");
    try {
      mountNavigation({ homepage: true, scroll: 2700 - 96 });
      flushNavigationFrame();
      expectCurrentSection("faq");
    } finally {
      window.history.replaceState(null, "", "/");
    }
  });

  it("waits for actual anchor scrolling and observes later hash changes", () => {
    const { nav, scrollToPosition } = mountNavigation({ homepage: true, mobile: false });
    flushNavigationFrame();
    const link = nav.querySelector('[href="#faq"]');
    // jsdom has no native layout/anchor scrolling; supply its resulting geometry.
    link.addEventListener("click", (event) => event.preventDefault(), { once: true });
    link.click();
    flushNavigationFrame();
    expectCurrentSection();
    scrollToPosition(2700 - 96);
    expectCurrentSection("faq");
    scrollToPosition(600 - 96, "hashchange");
    expectCurrentSection("o-nas");
  });

  it.each(["pageshow", "load"])("resynchronises restored or settled layout on %s", (event) => {
    const { scrollToPosition } = mountNavigation({ homepage: true });
    flushNavigationFrame();
    scrollToPosition(2800, event);
    expectCurrentSection("faq");
  });

  it("measures changing header geometry, including after compaction without ResizeObserver", () => {
    vi.stubGlobal("ResizeObserver", undefined);
    const { geometry, scrollToPosition } = mountNavigation({ homepage: true });
    geometry.headerBottom = 120;
    scrollToPosition(1000, "resize");
    expectCurrentSection("uslugi");
    geometry.headerBottom = 70;
    document.querySelector(".site-header").dispatchEvent(new Event("transitionend"));
    flushNavigationFrame();
    expectCurrentSection("o-nas");
  });

  it("observes header and section layout changes when ResizeObserver is available", () => {
    let onResize;
    const observe = vi.fn();
    vi.stubGlobal("ResizeObserver", class {
      constructor(callback) { onResize = callback; }
      observe = observe;
    });
    const { geometry } = mountNavigation({ homepage: true, scroll: 1000 });
    flushNavigationFrame();
    expect(observe).toHaveBeenCalledTimes(6);
    expectCurrentSection("o-nas");
    geometry.headerBottom = 120;
    onResize();
    flushNavigationFrame();
    expectCurrentSection("uslugi");
  });

  it("coalesces scroll events and avoids rewriting an unchanged marker", () => {
    mountNavigation({ homepage: true, scroll: 2800 });
    flushNavigationFrame();
    const link = document.querySelector('[href="#faq"]');
    const setAttribute = vi.spyOn(link, "setAttribute");
    const removeAttribute = vi.spyOn(link, "removeAttribute");
    window.requestAnimationFrame.mockClear();
    for (let i = 0; i < 5; i++) window.dispatchEvent(new Event("scroll"));
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    flushNavigationFrame();
    expectCurrentSection("faq");
    expect(setAttribute).not.toHaveBeenCalled();
    expect(removeAttribute).not.toHaveBeenCalled();
  });

  it("never moves focus, scrolls or writes browser navigation state", () => {
    const { scrollToPosition } = mountNavigation({ homepage: true });
    const outside = document.querySelector("#outsideControl");
    outside.focus();
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    const scrollTo = vi.spyOn(window, "scrollTo");
    const scrollIntoView = vi.fn();
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");
    const href = window.location.href;
    const historyLength = window.history.length;
    try {
      flushNavigationFrame();
      scrollToPosition(2800);
      expectCurrentSection("faq");
      expect(document.activeElement).toBe(outside);
      expect(window.scrollY).toBe(2800);
      expect(window.location.href).toBe(href);
      expect(window.history.length).toBe(historyLength);
      [focus, scrollTo, scrollIntoView, pushState, replaceState].forEach((spy) => expect(spy).not.toHaveBeenCalled());
    } finally {
      if (originalScrollIntoView) HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
      else delete HTMLElement.prototype.scrollIntoView;
    }
  });

  it("keeps the collapsed menu current and preserves focus and dismissal on reopening", () => {
    const { button, nav, firstLink, scrollToPosition } = mountNavigation({ homepage: true, scroll: 650 });
    flushNavigationFrame();
    openNavigation();
    expectCurrentSection("o-nas");
    expect(document.activeElement).toBe(firstLink);
    pressEscape();
    expect(document.activeElement).toBe(button);
    scrollToPosition(2800);
    expectCurrentSection("faq");
    openNavigation();
    expectCurrentSection("faq");
    expect(nav.getAttribute("aria-hidden")).toBe("false");
    expect(nav.hasAttribute("inert")).toBe(false);
    expect(document.activeElement).toBe(firstLink);
    pressEscape();
    expect(nav.getAttribute("aria-hidden")).toBe("true");
    expect(nav.hasAttribute("inert")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("preserves section tracking and menu state through both breakpoint transitions", () => {
    const { nav, geometry, scrollToPosition } = mountNavigation({ homepage: true, scroll: 1000 });
    flushNavigationFrame();
    openNavigation();
    geometry.headerBottom = 120;
    mediaQuery.setMatches(false);
    flushNavigationFrame();
    expectCurrentSection("uslugi");
    expect(nav.getAttribute("aria-hidden")).toBe("false");
    expect(nav.hasAttribute("inert")).toBe(false);
    geometry.headerBottom = 70;
    mediaQuery.setMatches(true);
    flushNavigationFrame();
    expectCurrentSection("o-nas");
    expect(nav.getAttribute("aria-hidden")).toBe("true");
    expect(nav.hasAttribute("inert")).toBe(true);
    scrollToPosition(2200);
    openNavigation();
    expectCurrentSection("galeria");
  });

  it("does not attach homepage tracking to service/legal-style navigation", () => {
    const { scrollToPosition } = mountNavigation({
      beforeInit() {
        document.querySelectorAll(".site-nav__link").forEach((link) => {
          link.setAttribute("href", `../index.html${link.getAttribute("href")}`);
        });
      },
    });
    scrollToPosition(2800);
    expectCurrentSection();
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(trackedGlobalListeners.some(([, type]) => ["hashchange", "pageshow", "load"].includes(type))).toBe(false);
    openNavigation();
    expect(document.querySelector("#primaryNav").classList.contains("mobile-open")).toBe(true);
  });

  it.each(["section", "link", "header"])("disables tracking safely when a required %s is missing", (element) => {
    const { scrollToPosition } = mountNavigation({
      homepage: true,
      beforeInit() {
        if (element === "section") document.getElementById("faq").remove();
        if (element === "link") document.querySelector('#primaryNav [href="#faq"]').remove();
        if (element === "header") document.querySelector(".site-header").classList.remove("site-header");
      },
    });
    scrollToPosition(2800);
    expectCurrentSection();
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    openNavigation();
    pressEscape();
    expect(document.querySelector("#nav-toggle").getAttribute("aria-expanded")).toBe("false");
  });

  it("works without observation APIs", () => {
    vi.stubGlobal("ResizeObserver", undefined);
    vi.stubGlobal("IntersectionObserver", undefined);
    const { scrollToPosition } = mountNavigation({ homepage: true });
    scrollToPosition(2800);
    expectCurrentSection("faq");
    openNavigation();
    pressEscape();
    expectCurrentSection("faq");
  });

  it.each(["requestAnimationFrame", "getComputedStyle", "matchMedia"])("keeps static links intact without %s", (api) => {
    const { nav, button } = mountNavigation({
      homepage: true,
      beforeInit() { vi.stubGlobal(api, undefined); },
    });
    expectCurrentSection();
    expect(nav.querySelector('[href="#faq"]')).not.toBeNull();
    expect(nav.querySelector('[aria-current="page"]')).not.toBeNull();
    if (api !== "matchMedia") {
      openNavigation();
      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("resize"));
      flushNavigationFrame();
      pressEscape();
      expect(button.getAttribute("aria-expanded")).toBe("false");
    }
  });
});
