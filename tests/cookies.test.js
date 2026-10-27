// EXTRA-03 — focused coverage for js/components/cookies.js.
//
// The suite drives the real module through a minimal copy of the production
// project-information modal and asserts focus, storage, cookie and body state.

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { initCookieBanner } from "../js/components/cookies.js";
import { COOKIE_BANNER } from "../js/core/config.js";

const COOKIE_FIXTURE = `
  <button id="pageControl" type="button">Kontrolka strony</button>
  <div id="cookieBanner" class="project-modal" role="dialog" aria-modal="true" aria-labelledby="projectInfoTitle" aria-describedby="projectInfoDesc" hidden>
    <div class="project-modal__overlay" aria-hidden="true"></div>
    <div class="project-modal__content" role="document" tabindex="-1">
      <h2 id="projectInfoTitle" class="project-modal__title">Informacja o projekcie</h2>
      <p id="projectInfoDesc" class="project-modal__text">
        Korzystając z serwisu, akceptujesz <a href="legal/regulamin.html">Regulamin</a>.
      </p>
      <p class="project-modal__links">
        <a href="legal/polityka-prywatnosci.html">Polityka prywatności</a>
        <a href="legal/polityka-cookies.html">Cookies</a>
      </p>
      <div class="project-modal__actions">
        <button id="cookieAccept" class="btn-primary" type="button">Akceptuję</button>
      </div>
    </div>
  </div>
`;

let animationFrames;

const originalOffsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetParent");

const clearConsentCookie = () => {
  document.cookie = `${COOKIE_BANNER.cookieName}=; Max-Age=0; path=/`;
};

const mountCookieBanner = () => {
  document.body.innerHTML = COOKIE_FIXTURE;
  const pageControl = document.querySelector("#pageControl");
  pageControl.focus();
  initCookieBanner();

  return {
    banner: document.querySelector("#cookieBanner"),
    pageControl,
  };
};

const flushAnimationFrames = () => {
  const frames = animationFrames.splice(0);
  frames.forEach((callback) => callback(0));
};

const pressKey = (key, init = {}) => {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
  document.activeElement.dispatchEvent(event);
  return event;
};

beforeAll(() => {
  // jsdom performs no layout, so every element reports offsetParent === null.
  // js/utils/a11y.js uses that property to drop non-rendered elements, so the
  // focus trap would otherwise be built from an empty list. This stub reports
  // the layout parent for rendered elements and null inside a [hidden] or
  // display: none subtree, as a browser does.
  Object.defineProperty(HTMLElement.prototype, "offsetParent", {
    configurable: true,
    get() {
      for (let node = this; node instanceof HTMLElement; node = node.parentElement) {
        if (node.hasAttribute("hidden") || document.defaultView.getComputedStyle(node).display === "none") return null;
      }
      return this.parentElement;
    },
  });
});

afterAll(() => {
  if (originalOffsetParent) Object.defineProperty(HTMLElement.prototype, "offsetParent", originalOffsetParent);
});

beforeEach(() => {
  localStorage.clear();
  clearConsentCookie();
  document.body.innerHTML = "";
  document.body.removeAttribute("style");
  animationFrames = [];
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    })
  );
});

afterEach(() => {
  animationFrames = [];
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  localStorage.clear();
  clearConsentCookie();
  document.body.innerHTML = "";
  document.body.removeAttribute("style");
});

describe("cookie modal opening", () => {
  it("removes the modal immediately when consent is already stored", () => {
    localStorage.setItem(COOKIE_BANNER.storageKey, JSON.stringify({ v: 1, value: "accepted" }));

    mountCookieBanner();

    expect(document.querySelector("#cookieBanner")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(animationFrames).toHaveLength(0);
  });

  it("reveals the modal, locks body scrolling and schedules initial focus", () => {
    const { banner, pageControl } = mountCookieBanner();

    expect(banner.hidden).toBe(false);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).toBe(pageControl);

    flushAnimationFrames();

    expect(document.activeElement).toBe(banner.querySelector("#cookieAccept"));
  });
});

describe("cookie modal keyboard behavior", () => {
  it("wraps Tab and Shift+Tab inside the modal", () => {
    const { banner } = mountCookieBanner();
    flushAnimationFrames();
    const firstLink = banner.querySelector('a[href]');
    const acceptButton = banner.querySelector("#cookieAccept");
    expect(document.activeElement).toBe(acceptButton);

    const tabEvent = pressKey("Tab");

    expect(tabEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(firstLink);

    const shiftTabEvent = pressKey("Tab", { shiftKey: true });

    expect(shiftTabEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(acceptButton);
  });

  it("prevents Tab once the modal no longer contains a focusable element", () => {
    const { banner } = mountCookieBanner();
    flushAnimationFrames();
    const modalContent = banner.querySelector(".project-modal__content");
    banner.querySelectorAll("a[href], button").forEach((el) => el.remove());
    modalContent.focus();

    const event = pressKey("Tab");

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(modalContent);
    expect(banner.isConnected).toBe(true);
  });

  it("prevents Escape without dismissing the modal", () => {
    const { banner } = mountCookieBanner();
    flushAnimationFrames();

    const event = pressKey("Escape");

    expect(event.defaultPrevented).toBe(true);
    expect(banner.isConnected).toBe(true);
    expect(banner.hidden).toBe(false);
    expect(document.body.style.overflow).toBe("hidden");
    expect(localStorage.getItem(COOKIE_BANNER.storageKey)).toBeNull();
  });
});

describe("cookie modal acceptance", () => {
  it("stores the configured localStorage value and cookie", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_788_480_000_000);
    const { banner } = mountCookieBanner();

    banner.querySelector("#cookieAccept").click();

    expect(JSON.parse(localStorage.getItem(COOKIE_BANNER.storageKey))).toEqual({
      v: 1,
      value: "accepted",
      ts: 1_788_480_000_000,
    });
    expect(document.cookie).toContain(`${COOKIE_BANNER.cookieName}=accepted`);
    expect(banner.isConnected).toBe(false);
  });

  it("restores the previous body overflow and returns focus", () => {
    document.body.style.overflow = "clip";
    const { banner, pageControl } = mountCookieBanner();
    flushAnimationFrames();
    expect(document.body.style.overflow).toBe("hidden");

    banner.querySelector("#cookieAccept").click();

    expect(document.body.style.overflow).toBe("clip");
    expect(document.activeElement).toBe(pageControl);
  });
});

describe("cookie modal storage failures", () => {
  it("opens, locks scrolling and focuses acceptance when reading storage throws", () => {
    const getItem = vi.spyOn(Object.getPrototypeOf(localStorage), "getItem").mockImplementation(() => {
      throw new Error("Storage read denied");
    });

    expect(() => mountCookieBanner()).not.toThrow();

    const banner = document.querySelector("#cookieBanner");
    expect(getItem).toHaveBeenCalledExactlyOnceWith(COOKIE_BANNER.storageKey);
    expect(banner.hidden).toBe(false);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).toBe(document.querySelector("#pageControl"));

    flushAnimationFrames();

    expect(document.activeElement).toBe(banner.querySelector("#cookieAccept"));
  });

  it("writes the cookie, dismisses and restores scrolling and focus when saving consent throws", () => {
    document.body.style.overflow = "clip";
    const { banner, pageControl } = mountCookieBanner();
    flushAnimationFrames();
    const acceptButton = banner.querySelector("#cookieAccept");
    expect(document.activeElement).toBe(acceptButton);
    expect(document.body.style.overflow).toBe("hidden");
    const setItem = vi.spyOn(Object.getPrototypeOf(localStorage), "setItem").mockImplementation(() => {
      throw new Error("Storage write denied");
    });

    expect(() => acceptButton.click()).not.toThrow();

    expect(setItem).toHaveBeenCalledExactlyOnceWith(COOKIE_BANNER.storageKey, expect.any(String));
    expect(document.querySelector("#cookieBanner")).toBeNull();
    expect(banner.isConnected).toBe(false);
    expect(document.body.style.overflow).toBe("clip");
    expect(document.activeElement).toBe(pageControl);
    expect(document.cookie).toContain(`${COOKIE_BANNER.cookieName}=accepted`);
  });
});
