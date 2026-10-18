// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://axiom.example/"}

import { URLSearchParams } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { initContactForm } from "../js/components/forms.js";
import { CONTACT_FORM } from "../js/core/config.js";

// Representative Netlify markup; no external scripts or captcha resources load.
const FORM_FIXTURE = `
  <form id="contactForm" name="contact" method="POST" action="/success.html"
    data-netlify="true" netlify-honeypot="trap" aria-describedby="formNote formStatus">
    <div id="errorSummary" class="visually-hidden" role="status" aria-live="assertive"></div>
    <a id="skipToError" class="visually-hidden-focusable" href="#errorSummary">Przejdź do pierwszego błędu</a>
    <input type="hidden" name="form-name" value="contact" />
    <div aria-hidden="true" inert>
      <label for="trap">Jeśli to widzisz, zostaw puste</label>
      <input id="trap" name="trap" tabindex="-1" autocomplete="off" />
    </div>
    <label for="name">Imię i nazwisko</label>
    <input id="name" name="name" required />
    <label for="email">Adres e-mail</label>
    <input type="email" id="email" name="email" required />
    <label for="phone">Telefon (opcjonalnie)</label>
    <input type="tel" id="phone" name="phone" pattern="^[0-9 +()-]{7,20}$" />
    <label for="subject">Temat</label>
    <input id="subject" name="subject" required />
    <label for="service">Rodzaj usługi</label>
    <select id="service" name="service" required>
      <option value="">-- Wybierz usługę --</option>
      <option value="remont">Remont mieszkania</option>
    </select>
    <label for="message">Wiadomość</label>
    <textarea id="message" name="message" required maxlength="500" aria-describedby="messageCounter"></textarea>
    <div id="messageCounter" aria-live="polite">0/500</div>
    <label for="consent"><input type="checkbox" id="consent" name="consent" required />Potwierdzam zapoznanie się z Polityką prywatności.</label>
    <p id="formNote">Pola powyżej są wymagane.</p>
    <fieldset data-recaptcha>
      <legend>Weryfikacja reCAPTCHA</legend>
      <div data-netlify-recaptcha="true"></div>
    </fieldset>
    <div id="formStatus" role="status" aria-live="polite"></div>
    <button type="submit">Wyślij wiadomość</button>
  </form>
`;

const VALUES = {
  name: "Łukasz Król",
  email: "lukasz+axiom@example.com",
  phone: "+48 600 000 000",
  subject: "Wycena & termin = zapytanie",
  service: "remont",
  message: "Proszę o wycenę: kuchnia & łazienka + salon.",
};

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

const submitForm = (form) => {
  const event = new Event("submit", { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
  return event;
};

const expectPreservedDraft = (form) => {
  for (const [name, value] of Object.entries(VALUES)) {
    expect(form.elements.namedItem(name).value).toBe(value);
  }
  expect(form.querySelector("#consent").checked).toBe(true);
  expect(localStorage.getItem(CONTACT_FORM.messageStorageKey)).toBe(VALUES.message);
};

let form;
let button;
let status;
let fetchMock;
let requestSubmitMock;
let submissionStates;

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  document.body.innerHTML = FORM_FIXTURE;
  form = document.querySelector("#contactForm");
  button = form.querySelector('button[type="submit"]');
  status = form.querySelector("#formStatus");

  // Even unexpected requests stay inert and visible to call-count assertions.
  fetchMock = vi.fn(() => new Promise(() => {}));
  vi.stubGlobal("fetch", fetchMock);
  const formPrototype = Object.getPrototypeOf(form);
  requestSubmitMock = vi.spyOn(formPrototype, "requestSubmit").mockImplementation(() => {
    throw new Error("Native fallback must be explicitly intercepted by the test");
  });
  vi.spyOn(formPrototype, "submit").mockImplementation(() => {
    throw new Error("Native navigation is not allowed in tests");
  });

  initContactForm();
  // Observe cancellation AFTER the production listener, then cancel everything
  // at the harness boundary. Synthetic dispatch never invokes native navigation.
  submissionStates = [];
  form.addEventListener("submit", (event) => {
    submissionStates.push(event.defaultPrevented);
    event.preventDefault();
  });
  for (const [name, value] of Object.entries(VALUES)) {
    const field = form.elements.namedItem(name);
    field.value = value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  }
  form.querySelector("#consent").checked = true;
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
  localStorage.clear();
});

describe("production contact submission", () => {
  it("POSTs encoded fields once while pending and clears the form and draft only after acknowledgement", async () => {
    const request = deferred();
    fetchMock.mockReturnValueOnce(request.promise);
    expect(globalThis.location.hostname).toBe("axiom.example");

    submitForm(form);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: expect.any(String),
    });
    const payload = new URLSearchParams(fetchMock.mock.calls[0][1].body);
    expect([...payload.entries()]).toEqual(Object.entries({
      "form-name": "contact",
      trap: "",
      ...VALUES,
      consent: "on",
    }));
    expect(form.getAttribute("aria-busy")).toBe("true");
    expect(button.disabled).toBe(true);
    expect(button.classList.contains("sending")).toBe(true);
    expect(button.textContent).toBe("Wysyłanie…");
    expect(status.textContent).toBe("Wysyłanie…");
    expectPreservedDraft(form);

    submitForm(form);
    expect(submissionStates).toEqual([true, true]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectPreservedDraft(form);
    expect(form.getAttribute("aria-busy")).toBe("true");
    expect(button.disabled).toBe(true);

    request.resolve({ ok: true });
    await request.promise;

    expect(form.getAttribute("aria-busy")).toBe("false");
    for (const name of Object.keys(VALUES)) {
      expect(form.elements.namedItem(name).value).toBe("");
    }
    expect(form.querySelector("#consent").checked).toBe(false);
    expect(form.elements.namedItem("form-name").value).toBe("contact");
    expect(localStorage.getItem(CONTACT_FORM.messageStorageKey)).toBeNull();
    expect(form.querySelector("#messageCounter").textContent).toBe(`0/${CONTACT_FORM.maxMessageLength}`);
    expect(status.textContent).toBe("Dziękujemy! Wiadomość została wysłana.");
    expect(status.classList.contains("ok")).toBe(true);
    expect(button.classList.contains("sending")).toBe(false);
    expect(button.classList.contains("sent")).toBe(true);
    expect(button.textContent).toBe("Wysłano ✓");
    expect(button.disabled).toBe(true);
    expect(requestSubmitMock).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1199);
    expect(button.disabled).toBe(true);
    await vi.advanceTimersByTimeAsync(1);
    expect(button.disabled).toBe(false);
    await vi.advanceTimersByTimeAsync(4799);
    expect(button.textContent).toBe("Wysłano ✓");
    expect(status.textContent).toBe("Dziękujemy! Wiadomość została wysłana.");
    await vi.advanceTimersByTimeAsync(1);
    expect(button.textContent).toBe("Wyślij wiadomość");
    expect(button.classList.contains("sent")).toBe(false);
    expect(status.textContent).toBe("");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each(["network rejection", "non-OK response"])("preserves the draft and allows one native fallback after %s, then permits a retry", async (failure) => {
    const request = deferred();
    const networkError = new Error("Network unavailable");
    const errorMock = vi.spyOn(globalThis.console, "error").mockImplementation(() => {});
    fetchMock.mockReturnValueOnce(request.promise);
    requestSubmitMock.mockImplementation(function () {
      expect(this).toBe(form);
      // The real submit handler must leave this event uncanceled; the listener
      // installed above records that decision before preventing navigation.
      submitForm(this);
    });

    submitForm(form);
    expect(form.getAttribute("aria-busy")).toBe("true");
    expect(button.disabled).toBe(true);
    expectPreservedDraft(form);
    expect(requestSubmitMock).not.toHaveBeenCalled();

    if (failure === "network rejection") {
      request.reject(networkError);
      await request.promise.catch(() => {});
    } else {
      request.resolve({ ok: false, status: 503 });
      await request.promise;
    }

    expect(requestSubmitMock).toHaveBeenCalledTimes(1);
    expect(submissionStates).toEqual([true, false]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectPreservedDraft(form);
    expect(form.hasAttribute("aria-busy")).toBe(false);
    expect(button.disabled).toBe(false);
    expect(button.classList.contains("sending")).toBe(false);
    expect(button.classList.contains("sent")).toBe(false);
    expect(button.textContent).toBe("Wyślij wiadomość");
    expect(status.classList.contains("err")).toBe(true);
    expect(status.textContent).toBe("Nie udało się wysłać przez ulepszony tryb. Wysyłamy formularz standardowo…");
    expect(errorMock).toHaveBeenCalledExactlyOnceWith(
      failure === "network rejection" ? networkError : expect.objectContaining({ message: "Netlify response not OK" }),
    );

    // With navigation intercepted, a later submit must use enhancement again:
    // the one-shot fallback flag must already have been consumed.
    const retry = deferred();
    fetchMock.mockReturnValueOnce(retry.promise);
    submitForm(form);
    expect(submissionStates).toEqual([true, false, true]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(form.getAttribute("aria-busy")).toBe("true");
    expect(button.disabled).toBe(true);
    expectPreservedDraft(form);
    retry.resolve({ ok: true });
    await retry.promise;
    expect(form.getAttribute("aria-busy")).toBe("false");
    expect(form.querySelector("#message").value).toBe("");
    expect(localStorage.getItem(CONTACT_FORM.messageStorageKey)).toBeNull();
    expect(status.textContent).toBe("Dziękujemy! Wiadomość została wysłana.");
    expect(requestSubmitMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
