import { SELECTORS } from "../core/config.js";
import { qs } from "../utils/dom.js";

export const initNavigation = () => {
  const btn = qs(SELECTORS.navToggle);
  const nav = qs(SELECTORS.primaryNav);
  if (!btn || !nav || typeof window.matchMedia !== "function") return;
  const header = btn.closest("header");
  const mql = window.matchMedia("(max-width: 899px)");
  const sectionEntries = ["o-nas", "uslugi", "galeria", "faq", "kontakt"].map((id) => ({
    link: nav.querySelector(`.site-nav__link[href="#${id}"]`),
    section: document.getElementById(id),
  }));
  const tracksSections =
    header?.matches(".site-header") &&
    typeof window.requestAnimationFrame === "function" &&
    typeof window.getComputedStyle === "function" &&
    sectionEntries.every(({ link, section }) => link && section?.matches("main section"));
  let currentSectionLink = null;
  const syncCurrentSection = () => {
    if (!tracksSections) return;
    // Native anchors can leave a small gap below the header. Use one reading
    // line for all sections, including that existing scroll-margin allowance.
    const readingPosition =
      Math.max(
        0,
        header.getBoundingClientRect().bottom,
        ...sectionEntries.map(({ section }) => parseFloat(window.getComputedStyle(section).scrollMarginTop) || 0)
      ) + 1;
    const nextLink = sectionEntries.find(({ section }) => {
      const { top, bottom } = section.getBoundingClientRect();
      return top <= readingPosition && bottom > readingPosition;
    })?.link || null;
    if (nextLink === currentSectionLink) return;
    currentSectionLink?.removeAttribute("data-current-section");
    nextLink?.setAttribute("data-current-section", "true");
    currentSectionLink = nextLink;
  };
  if (!btn.hasAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "false");
  let lastTrigger = null;
  let syncFrame = 0;
  const unlock = () => document.body.classList.remove("nav-open");
  const lock = () => document.body.classList.add("nav-open");
  const syncMobileNavPosition = () => {
    if (!header || !mql.matches) return;
    const headerBottom = Math.ceil(header.getBoundingClientRect().bottom);
    const topOffset = Math.max(0, headerBottom);
    const maxHeight = Math.max(160, window.innerHeight - topOffset - 16);
    document.documentElement.style.setProperty("--mobile-nav-top", `${topOffset}px`);
    document.documentElement.style.setProperty("--mobile-nav-max-height", `${maxHeight}px`);
  };
  const queueSyncNavigation = () => {
    if (typeof window.requestAnimationFrame !== "function") {
      syncMobileNavPosition();
      return;
    }
    if (syncFrame) return;
    syncFrame = window.requestAnimationFrame(() => {
      syncFrame = 0;
      syncMobileNavPosition();
      syncCurrentSection();
    });
  };
  const applyDesktopState = () => {
    nav.classList.remove("mobile-open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Otwórz menu");
    nav.toggleAttribute("inert", false);
    nav.setAttribute("aria-hidden", "false");
    unlock();
    removeOutsideClick();
  };
  const applyMobileCollapsed = () => {
    nav.classList.remove("mobile-open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Otwórz menu");
    nav.toggleAttribute("inert", true);
    nav.setAttribute("aria-hidden", "true");
    unlock();
    removeOutsideClick();
  };
  const closeMenu = () => {
    nav.classList.remove("mobile-open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Otwórz menu");
    nav.toggleAttribute("inert", true);
    nav.setAttribute("aria-hidden", "true");
    unlock();
    (lastTrigger || btn).focus({ preventScroll: true });
    lastTrigger = null;
    removeOutsideClick();
  };
  const openMenu = () => {
    syncMobileNavPosition();
    nav.classList.add("mobile-open");
    btn.classList.add("active");
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Zamknij menu");
    nav.toggleAttribute("inert", false);
    nav.setAttribute("aria-hidden", "false");
    lock();
    lastTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : btn;
    const firstLink = nav.querySelector(".site-nav__link");
    if (firstLink && typeof firstLink.focus === "function") {
      firstLink.focus({ preventScroll: true });
    }
    addOutsideClick();
  };
  const toggleMenu = () => (nav.classList.contains("mobile-open") ? closeMenu() : openMenu());
  btn.addEventListener("click", toggleMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("mobile-open")) closeMenu();
  });
  window.addEventListener(
    "scroll",
    () => {
      if (tracksSections || nav.classList.contains("mobile-open")) queueSyncNavigation();
    },
    { passive: true }
  );
  window.addEventListener("resize", queueSyncNavigation, { passive: true });
  if (tracksSections) {
    window.addEventListener("pageshow", queueSyncNavigation);
    window.addEventListener("hashchange", queueSyncNavigation);
    window.addEventListener("load", queueSyncNavigation, { once: true });
    header.addEventListener("transitionend", queueSyncNavigation);
    if (typeof window.ResizeObserver === "function") {
      const resizeObserver = new window.ResizeObserver(queueSyncNavigation);
      resizeObserver.observe(header);
      sectionEntries.forEach(({ section }) => resizeObserver.observe(section));
    }
    queueSyncNavigation();
  }
  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a[href], area[href]");
    if (link && mql.matches) closeMenu();
  });
  let outsideClickHandler = null;
  function addOutsideClick() {
    if (outsideClickHandler) return;
    outsideClickHandler = (e) => {
      if (!nav.classList.contains("mobile-open")) return;
      const inNav = nav.contains(e.target);
      const onBtn = btn.contains(e.target);
      if (!inNav && !onBtn) closeMenu();
    };
    document.addEventListener("pointerdown", outsideClickHandler, true);
  }
  function removeOutsideClick() {
    if (!outsideClickHandler) return;
    document.removeEventListener("pointerdown", outsideClickHandler, true);
    outsideClickHandler = null;
  }
  const onChange = (e) => {
    if (e.matches) {
      syncMobileNavPosition();
      applyMobileCollapsed();
    } else {
      applyDesktopState();
    }
    if (tracksSections) queueSyncNavigation();
  };
  if (mql.addEventListener) mql.addEventListener("change", onChange);
  else if (mql.addListener) mql.addListener(onChange);
  if (mql.matches) applyMobileCollapsed();
  else applyDesktopState();
};
