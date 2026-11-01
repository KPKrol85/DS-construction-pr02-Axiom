// @vitest-environment node

import { readFileSync } from "node:fs";
import { URL } from "node:url";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// jsdom defaults keep scripts inert and external resource loading disabled.
const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const { document } = new JSDOM(indexHtml).window;

describe("contact form Netlify markup", () => {
  it("enables Netlify-provided reCAPTCHA on the form and its single empty widget container", () => {
    const form = document.querySelector("#contactForm");
    const containers = document.querySelectorAll('[data-netlify-recaptcha="true"]');

    expect(form.getAttribute("data-netlify")).toBe("true");
    expect(form.getAttribute("data-netlify-recaptcha")).toBe("true");
    expect(containers).toHaveLength(2);

    const [formElement, container] = containers;
    expect(formElement).toBe(form);
    expect(container.tagName).toBe("DIV");
    expect(form.contains(container)).toBe(true);
    expect(container.childNodes).toHaveLength(0);
  });

  it("gives the optional telephone field a pattern that compiles with the HTML v flag", () => {
    const phone = document.querySelector("#phone");
    const pattern = phone.getAttribute("pattern");

    // Browsers compile the attribute as ^(?:pattern)$ with the v flag and
    // ignore it, logging a SyntaxError, when it does not compile.
    expect(() => new RegExp(`^(?:${pattern})$`, "v")).not.toThrow();
    expect(phone.required).toBe(false);
    expect(phone.validity.valid).toBe(true);

    for (const value of ["+48 600 000 000", "600000000", "(12) 345-67-89", "+48-600-000-000"]) {
      phone.value = value;
      expect(phone.validity.patternMismatch, value).toBe(false);
    }
    for (const value of ["123456", "600 000 000 wew.", "600_000_000", "1".repeat(21)]) {
      phone.value = value;
      expect(phone.validity.patternMismatch, value).toBe(true);
    }
  });
});
