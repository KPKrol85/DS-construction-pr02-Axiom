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
});
