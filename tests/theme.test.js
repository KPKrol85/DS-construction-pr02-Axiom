import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { initThemeToggle } from "../js/components/theme.js";

const earlyThemeSource = readFileSync("js/theme-init.js", "utf8");
const SYSTEM_QUERY = "(prefers-color-scheme: dark)";
const THEME_STATES = {
  light: {
    logo: "assets/img/logo/logo-light.svg",
    pressed: "false",
    label: "Przełącz na ciemny motyw",
  },
  dark: {
    logo: "assets/img/logo/logo-dark.svg",
    pressed: "true",
    label: "Przełącz na jasny motyw",
  },
};
const THEME_FIXTURE = `
  <header>
    <img class="header__logo theme-logo" src="assets/img/logo/logo-light.svg"
      data-light="assets/img/logo/logo-light.svg" data-dark="assets/img/logo/logo-dark.svg"
      alt="Axiom Construction — logo" />
    <button id="themeToggleDesktop" class="theme-toggle" aria-pressed="false"
      aria-label="Przełącz motyw" title="Przełącz motyw (Jasny/Ciemny)">
      <svg aria-hidden="true"></svg>
    </button>
  </header>
  <footer>
    <img class="footer__logo theme-logo" src="assets/img/logo/logo-light.svg"
      data-light="assets/img/logo/logo-light.svg" data-dark="assets/img/logo/logo-dark.svg"
      alt="Axiom Construction — logo" />
  </footer>
`;

let mediaQuery;
let setItem;

const mockSystemTheme = (initialMatches, api = "modern") => {
  const listeners = new Set();
  mediaQuery = {
    matches: initialMatches,
    media: SYSTEM_QUERY,
    addListener: vi.fn((listener) => listeners.add(listener)),
    setMatches(matches) {
      if (this.matches === matches) return;
      this.matches = matches;
      listeners.forEach((listener) => listener({ matches, media: this.media }));
    },
    clearListeners() {
      listeners.clear();
    },
  };
  if (api === "modern") {
    mediaQuery.addEventListener = vi.fn((type, listener) => {
      if (type === "change") listeners.add(listener);
    });
  }
  vi.stubGlobal("matchMedia", vi.fn(() => mediaQuery));
  return mediaQuery;
};

const runEarlyInitializer = () => {
  // A fresh VM executes the classic script against this test's jsdom state;
  // its script variables never enter the Vitest/global module environment.
  runInNewContext(earlyThemeSource, {
    document,
    window: globalThis.window,
    localStorage,
  }, { filename: "js/theme-init.js" });
};

const expectTheme = (mode) => {
  const expected = THEME_STATES[mode];
  expect(document.documentElement.getAttribute("data-theme")).toBe(mode);
  const logos = document.querySelectorAll(".theme-logo");
  expect(logos).toHaveLength(2);
  logos.forEach((logo) => {
    // getAttribute preserves the relative URL contract, unlike img.src.
    expect(logo.getAttribute("src")).toBe(expected.logo);
  });
  const button = document.querySelector("#themeToggleDesktop");
  expect(button.getAttribute("aria-pressed")).toBe(expected.pressed);
  expect(button.getAttribute("aria-label")).toBe(expected.label);
};

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("class");
  document.body.innerHTML = THEME_FIXTURE;
  setItem = vi.spyOn(Object.getPrototypeOf(localStorage), "setItem");
});

afterEach(() => {
  // The module has no teardown API. Discard this test's media listeners and
  // button nodes rather than expecting production to unregister its handlers.
  mediaQuery?.clearListeners();
  mediaQuery = undefined;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
  document.body.replaceChildren();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("class");
});

describe("stored theme preference", () => {
  it.each([
    { saved: "light", systemDark: true },
    { saved: "dark", systemDark: false },
  ])("preserves stored $saved across both initializers and opposing system changes", ({ saved, systemDark }) => {
    localStorage.setItem("theme", saved);
    setItem.mockClear();
    const system = mockSystemTheme(systemDark);

    runEarlyInitializer();

    expect(document.documentElement.getAttribute("data-theme")).toBe(saved);
    expect(document.documentElement.classList.contains("js")).toBe(true);
    expect(localStorage.getItem("theme")).toBe(saved);
    expect(setItem).not.toHaveBeenCalled();

    initThemeToggle();

    expectTheme(saved);
    expect(globalThis.window.matchMedia).toHaveBeenCalledWith(SYSTEM_QUERY);
    expect(system.addEventListener).not.toHaveBeenCalled();
    expect(system.addListener).not.toHaveBeenCalled();

    system.setMatches(!systemDark);
    expectTheme(saved);
    system.setMatches(systemDark);
    expectTheme(saved);
    expect(localStorage.getItem("theme")).toBe(saved);
    expect(setItem).not.toHaveBeenCalled();
  });
});

describe.each(["modern", "legacy"])("system theme with the %s media-query API", (api) => {
  it.each([
    { initial: "light", systemDark: false, changed: "dark" },
    { initial: "dark", systemDark: true, changed: "light" },
  ])("initializes $initial and follows system changes without persisting a choice", ({ initial, systemDark, changed }) => {
    const system = mockSystemTheme(systemDark, api);

    runEarlyInitializer();

    expect(document.documentElement.getAttribute("data-theme")).toBe(initial);
    expect(localStorage.getItem("theme")).toBeNull();
    expect(setItem).not.toHaveBeenCalled();

    initThemeToggle();

    expectTheme(initial);
    expect(globalThis.window.matchMedia).toHaveBeenCalledWith(SYSTEM_QUERY);
    expect(localStorage.getItem("theme")).toBeNull();
    expect(setItem).not.toHaveBeenCalled();
    if (api === "modern") {
      expect(system.addEventListener).toHaveBeenCalledExactlyOnceWith("change", expect.any(Function));
      expect(system.addListener).not.toHaveBeenCalled();
    } else {
      expect(system.addEventListener).toBeUndefined();
      expect(system.addListener).toHaveBeenCalledExactlyOnceWith(expect.any(Function));
    }

    system.setMatches(!systemDark);

    expectTheme(changed);
    expect(localStorage.getItem("theme")).toBeNull();
    expect(setItem).not.toHaveBeenCalled();

    system.setMatches(systemDark);

    expectTheme(initial);
    expect(localStorage.getItem("theme")).toBeNull();
    expect(setItem).not.toHaveBeenCalled();
  });
});

describe("manual theme selection", () => {
  it.each([
    { initial: "light", systemDark: false, selected: "dark" },
    { initial: "dark", systemDark: true, selected: "light" },
  ])("switches $initial to $selected and back, synchronizing controls and persistence", ({ initial, systemDark, selected }) => {
    mockSystemTheme(systemDark);
    runEarlyInitializer();
    expect(document.documentElement.getAttribute("data-theme")).toBe(initial);
    initThemeToggle();
    expectTheme(initial);
    expect(localStorage.getItem("theme")).toBeNull();
    expect(setItem).not.toHaveBeenCalled();
    const button = document.querySelector("#themeToggleDesktop");

    button.click();

    expectTheme(selected);
    expect(localStorage.getItem("theme")).toBe(selected);
    expect(setItem).toHaveBeenCalledExactlyOnceWith("theme", selected);

    button.click();

    expectTheme(initial);
    expect(localStorage.getItem("theme")).toBe(initial);
    expect(setItem).toHaveBeenCalledTimes(2);
    expect(setItem).toHaveBeenNthCalledWith(2, "theme", initial);
  });
});
