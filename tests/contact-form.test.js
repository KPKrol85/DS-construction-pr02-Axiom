// PH4-02 — focused coverage for js/components/forms.js.
//
// The suite drives the real module through a minimal but realistic copy of the
// contact-form markup from index.html and only asserts observable behavior:
// attributes, classes, focus, counter text, status text and localStorage.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { initContactForm } from "../js/components/forms.js";
import { CONTACT_FORM } from "../js/core/config.js";

const FORM_FIXTURE = `
  <form id="contactForm" name="contact" method="POST" action="/success.html" class="contact-form" aria-describedby="formNote formStatus">
    <div id="errorSummary" class="visually-hidden" role="status" aria-live="assertive" aria-atomic="true"></div>
    <a id="skipToError" class="visually-hidden-focusable" href="#errorSummary">Przejdź do pierwszego błędu</a>
    <input type="hidden" name="form-name" value="contact" />
    <div class="form__group">
      <label for="name">Imię i nazwisko</label>
      <input type="text" id="name" name="name" required autocomplete="name" />
    </div>
    <div class="form__group">
      <label for="email">Adres e-mail</label>
      <input type="email" id="email" name="email" required autocomplete="email" />
    </div>
    <div class="form__group">
      <label for="phone">Telefon (opcjonalnie)</label>
      <input type="tel" id="phone" name="phone" pattern="^[0-9 +()-]{7,20}$" />
    </div>
    <div class="form__group">
      <label for="subject">Temat</label>
      <input type="text" id="subject" name="subject" required />
    </div>
    <div class="form__group">
      <label for="service">Rodzaj usługi</label>
      <select id="service" name="service" required>
        <option value="">-- Wybierz usługę --</option>
        <option value="remont">Remont mieszkania</option>
      </select>
    </div>
    <div class="form__group">
      <label for="message">Wiadomość</label>
      <textarea id="message" name="message" rows="5" required maxlength="500" aria-describedby="messageCounter"></textarea>
      <div id="messageCounter" class="form__char-counter" aria-live="polite">0/500</div>
    </div>
    <div class="form__group form__consent">
      <label class="form__consent-label" for="consent">
        <input type="checkbox" id="consent" name="consent" required />
        <span>Potwierdzam zapoznanie się z <a href="legal/polityka-prywatnosci.html">Polityką prywatności</a>.</span>
      </label>
    </div>
    <p id="formNote" class="form__note">Pola powyżej są wymagane.</p>
    <div id="formStatus" class="form__status" role="status" aria-live="polite"></div>
    <button type="submit" class="btn btn-primary">Wyślij wiadomość</button>
  </form>
`;

let fetchMock;

const mountForm = () => {
  document.body.innerHTML = FORM_FIXTURE;
  initContactForm();
  return document.querySelector("#contactForm");
};

const fillValidForm = (form) => {
  form.querySelector("#name").value = "Jan Kowalski";
  form.querySelector("#email").value = "jan@example.com";
  form.querySelector("#subject").value = "Wycena remontu";
  form.querySelector("#service").value = "remont";
  form.querySelector("#message").value = "Proszę o wycenę remontu mieszkania.";
  form.querySelector("#consent").checked = true;
};

const typeInto = (field, value) => {
  field.value = value;
  field.dispatchEvent(new Event("input", { bubbles: true }));
};

const submitForm = (form) => {
  const event = new Event("submit", { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
  return event;
};

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = "";
  // A real request would be a test defect, so fetch is replaced by a stub that
  // fails loudly and can be asserted on.
  fetchMock = vi.fn(() => Promise.reject(new Error("Network access is not allowed in tests")));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
  localStorage.clear();
});

describe("contact form validation", () => {
  it("blocks submission and marks every empty required field as invalid", () => {
    const form = mountForm();

    const event = submitForm(form);

    expect(event.defaultPrevented).toBe(true);
    CONTACT_FORM.requiredFields.forEach((id) => {
      const field = form.querySelector(`#${id}`);
      expect(field.classList.contains("is-invalid")).toBe(true);
      expect(field.getAttribute("aria-invalid")).toBe("true");
    });
    const consent = form.querySelector("#consent");
    expect(consent.classList.contains("is-invalid")).toBe(true);
    expect(consent.getAttribute("aria-invalid")).toBe("true");
  });

  it("moves focus to the first invalid field", () => {
    const form = mountForm();

    submitForm(form);

    expect(document.activeElement).toBe(form.querySelector("#name"));
  });

  it("rejects a malformed e-mail address and reports it in the status region", () => {
    const form = mountForm();
    fillValidForm(form);
    form.querySelector("#email").value = "jan(at)example.com";

    const event = submitForm(form);

    expect(event.defaultPrevented).toBe(true);
    expect(form.querySelector("#email").classList.contains("is-invalid")).toBe(true);
    const status = form.querySelector("#formStatus");
    expect(status.classList.contains("err")).toBe(true);
    expect(status.textContent.trim().length).toBeGreaterThan(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("clears the invalid state once the field is corrected", () => {
    const form = mountForm();
    submitForm(form);
    const name = form.querySelector("#name");
    expect(name.classList.contains("is-invalid")).toBe(true);

    typeInto(name, "Jan Kowalski");

    expect(name.classList.contains("is-invalid")).toBe(false);
    expect(name.hasAttribute("aria-invalid")).toBe(false);
  });
});

describe("contact form error summary", () => {
  it("reveals the accessible summary with a labelled link to every invalid field in form order", () => {
    const form = mountForm();
    const summary = form.querySelector("#errorSummary");
    const skipLink = form.querySelector("#skipToError");
    expect(summary.classList.contains("visually-hidden")).toBe(true);

    submitForm(form);

    expect(summary.classList.contains("visually-hidden")).toBe(false);
    expect(skipLink.classList.contains("visually-hidden")).toBe(false);
    expect(summary.getAttribute("role")).toBe("status");
    expect(summary.getAttribute("aria-live")).toBe("assertive");
    expect(summary.getAttribute("aria-atomic")).toBe("true");
    const invalidFields = Array.from(form.querySelectorAll(".is-invalid"));
    const links = Array.from(summary.querySelectorAll("a"));
    expect(links).toHaveLength(invalidFields.length);
    expect(summary.textContent).toMatch(/^Formularz zawiera 6 błędów: /);
    invalidFields.forEach((field, index) => {
      const label = form.querySelector(`label[for="${field.id}"]`);
      expect(links[index].textContent).toBe(label.textContent.trim().replace(/\s+/g, " "));
      expect(links[index].getAttribute("href")).toBe(`#${field.id}`);
      expect(links[index].tabIndex).toBe(0);
      expect(links[index].hasAttribute("role")).toBe(false);
    });
  });

  it.each([[1, "błąd"], [2, "błędy"], [4, "błędy"], [5, "błędów"]])("preserves the Polish count message for %i invalid fields", (count, suffix) => {
    const form = mountForm();
    fillValidForm(form);
    CONTACT_FORM.requiredFields.slice(0, count).forEach((id) => {
      form.querySelector(`#${id}`).value = "";
    });

    submitForm(form);

    expect(form.querySelector("#errorSummary").textContent).toMatch(`Formularz zawiera ${count} ${suffix}: `);
  });

  it("focuses each linked control without navigation, validation, submission or value changes", () => {
    const form = mountForm();
    form.querySelector("#email").value = "jan(at)example.com";
    form.querySelector("#phone").value = "niepoprawny telefon";
    form.querySelector("#message").value = "x".repeat(CONTACT_FORM.maxMessageLength + 1);
    submitForm(form);
    const values = Array.from(new FormData(form).entries());
    const invalidFields = Array.from(form.querySelectorAll(".is-invalid"));
    const status = form.querySelector("#formStatus").textContent;
    const url = location.href;
    const onSubmit = vi.fn();
    form.addEventListener("submit", onSubmit);

    form.querySelectorAll("#errorSummary a").forEach((link, index) => {
      link.focus();
      const click = new MouseEvent("click", { bubbles: true, cancelable: true });
      link.dispatchEvent(click);

      expect(click.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(invalidFields[index]);
      expect(Array.from(new FormData(form).entries())).toEqual(values);
      expect(form.querySelector("#consent").checked).toBe(false);
      expect(invalidFields[index].getAttribute("aria-invalid")).toBe("true");
    });
    const consent = form.querySelector("#consent");
    consent.checked = true;
    form.querySelector('#errorSummary a[href="#consent"]').click();
    expect(consent.checked).toBe(true);
    expect(document.activeElement).toBe(consent);
    expect(form.querySelector("#formStatus").textContent).toBe(status);
    expect(location.href).toBe(url);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses implicit labels and renders label text safely", () => {
    const form = mountForm();
    const label = form.querySelector('label[for="email"]');
    label.removeAttribute("for");
    label.textContent = 'Adres <img src="x" onerror="alert(1)"> e-mail';
    label.append(form.querySelector("#email"));

    submitForm(form);

    const link = form.querySelector('#errorSummary a[href="#email"]');
    expect(link.textContent).toBe('Adres <img src="x" onerror="alert(1)"> e-mail');
    expect(link.children).toHaveLength(0);
  });

  it("falls back to the accessible name or control name when a label is unavailable", () => {
    const form = mountForm();
    form.querySelector('label[for="email"]').remove();
    form.querySelector("#email").setAttribute("aria-label", "Adres kontaktowy");
    form.querySelector('label[for="subject"]').remove();

    submitForm(form);

    expect(form.querySelector('#errorSummary a[href="#email"]').textContent).toBe("Adres kontaktowy");
    expect(form.querySelector('#errorSummary a[href="#subject"]').textContent).toBe("subject");
  });

  it("preserves initial focus and both shortcuts to the current first invalid field", () => {
    const form = mountForm();
    submitForm(form);
    expect(document.activeElement).toBe(form.querySelector("#name"));
    typeInto(form.querySelector("#name"), "Jan Kowalski");
    form.querySelector("#message").focus();
    form.querySelector("#skipToError").click();
    expect(document.activeElement).toBe(form.querySelector("#email"));
    form.querySelector("#message").focus();
    const shortcut = new KeyboardEvent("keydown", {
      key: "E", code: "KeyE", altKey: true, shiftKey: true, bubbles: true, cancelable: true,
    });

    document.activeElement.dispatchEvent(shortcut);

    expect(shortcut.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(form.querySelector("#email"));
  });

  it("hides the summary again once no field is invalid", () => {
    const form = mountForm();
    submitForm(form);
    const summary = form.querySelector("#errorSummary");
    const skipLink = form.querySelector("#skipToError");
    expect(summary.classList.contains("visually-hidden")).toBe(false);

    fillValidForm(form);
    Array.from(form.querySelectorAll(".is-invalid")).forEach((field) => {
      field.dispatchEvent(new Event("input", { bubbles: true }));
      if (form.querySelector(".is-invalid")) {
        expect(summary.classList.contains("visually-hidden")).toBe(false);
        expect(skipLink.classList.contains("visually-hidden")).toBe(false);
      }
    });

    expect(summary.classList.contains("visually-hidden")).toBe(true);
    expect(skipLink.classList.contains("visually-hidden")).toBe(true);
  });
});

describe("contact form message limit", () => {
  it("constrains the message to the configured maximum length", () => {
    const form = mountForm();
    const message = form.querySelector("#message");
    const counter = form.querySelector("#messageCounter");

    typeInto(message, "x".repeat(CONTACT_FORM.maxMessageLength + 120));

    expect(message.value).toHaveLength(CONTACT_FORM.maxMessageLength);
    expect(counter.textContent).toBe(`${CONTACT_FORM.maxMessageLength}/${CONTACT_FORM.maxMessageLength}`);
    expect(counter.classList.contains("limit")).toBe(true);
  });

  it("keeps a shorter message untouched and counts it", () => {
    const form = mountForm();
    const message = form.querySelector("#message");
    const counter = form.querySelector("#messageCounter");

    typeInto(message, "Dzień dobry");

    expect(message.value).toBe("Dzień dobry");
    expect(counter.textContent).toBe(`11/${CONTACT_FORM.maxMessageLength}`);
    expect(counter.classList.contains("limit")).toBe(false);
  });
});

describe("contact form draft persistence", () => {
  it("stores the typed message under the configured storage key", () => {
    const form = mountForm();

    typeInto(form.querySelector("#message"), "Szkic wiadomości");

    expect(localStorage.getItem(CONTACT_FORM.messageStorageKey)).toBe("Szkic wiadomości");
  });

  it("restores a saved draft when the form is initialised", () => {
    localStorage.setItem(CONTACT_FORM.messageStorageKey, "Wcześniejszy szkic");

    const form = mountForm();

    expect(form.querySelector("#message").value).toBe("Wcześniejszy szkic");
    expect(form.querySelector("#messageCounter").textContent).toBe(`18/${CONTACT_FORM.maxMessageLength}`);
  });

  it("removes the draft after a successful local submission", async () => {
    vi.useFakeTimers();
    localStorage.setItem(CONTACT_FORM.messageStorageKey, "Wcześniejszy szkic");
    const form = mountForm();
    fillValidForm(form);
    const status = form.querySelector("#formStatus");
    const submitBtn = form.querySelector('button[type="submit"]');

    const event = submitForm(form);
    expect(event.defaultPrevented).toBe(true);
    expect(form.getAttribute("aria-busy")).toBe("true");

    await vi.advanceTimersByTimeAsync(500);

    expect(localStorage.getItem(CONTACT_FORM.messageStorageKey)).toBeNull();
    expect(form.getAttribute("aria-busy")).toBe("false");
    expect(form.querySelector("#message").value).toBe("");
    expect(form.querySelector("#messageCounter").textContent).toBe(`0/${CONTACT_FORM.maxMessageLength}`);
    expect(status.classList.contains("ok")).toBe(true);
    expect(status.textContent.trim().length).toBeGreaterThan(0);
    expect(submitBtn.classList.contains("sent")).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("contact form storage failures", () => {
  it("initialises and keeps the message and counter usable when reading a draft throws", () => {
    const getItem = vi.spyOn(Object.getPrototypeOf(localStorage), "getItem").mockImplementation(() => {
      throw new Error("Storage read denied");
    });

    expect(() => mountForm()).not.toThrow();

    const message = document.querySelector("#message");
    const counter = document.querySelector("#messageCounter");
    expect(getItem).toHaveBeenCalledExactlyOnceWith(CONTACT_FORM.messageStorageKey);
    expect(message.value).toBe("");
    expect(counter.textContent).toBe(`0/${CONTACT_FORM.maxMessageLength}`);

    expect(() => typeInto(message, "Nowa wiadomość")).not.toThrow();

    expect(message.value).toBe("Nowa wiadomość");
    expect(counter.textContent).toBe(`${message.value.length}/${CONTACT_FORM.maxMessageLength}`);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps typed content and updates the counter when saving a draft throws", () => {
    const form = mountForm();
    const message = form.querySelector("#message");
    const counter = form.querySelector("#messageCounter");
    const setItem = vi.spyOn(Object.getPrototypeOf(localStorage), "setItem").mockImplementation(() => {
      throw new Error("Storage write denied");
    });

    for (const value of ["Szkic", "Szkic wiadomości"]) {
      expect(() => typeInto(message, value)).not.toThrow();
      expect(message.value).toBe(value);
      expect(counter.textContent).toBe(`${value.length}/${CONTACT_FORM.maxMessageLength}`);
      expect(setItem).toHaveBeenLastCalledWith(CONTACT_FORM.messageStorageKey, value);
    }
    expect(setItem).toHaveBeenCalledTimes(2);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("resets the form and shows local submission success when removing the draft throws", async () => {
    vi.useFakeTimers();
    localStorage.setItem(CONTACT_FORM.messageStorageKey, "Wcześniejszy szkic");
    const form = mountForm();
    fillValidForm(form);
    typeInto(form.querySelector("#message"), form.querySelector("#message").value);
    const status = form.querySelector("#formStatus");
    const submitBtn = form.querySelector('button[type="submit"]');
    const requestSubmit = vi.spyOn(form, "requestSubmit").mockImplementation(() => {});
    const removeItem = vi.spyOn(Object.getPrototypeOf(localStorage), "removeItem").mockImplementation(() => {
      throw new Error("Storage removal denied");
    });

    expect(submitForm(form).defaultPrevented).toBe(true);
    await vi.advanceTimersByTimeAsync(499);
    expect(form.getAttribute("aria-busy")).toBe("true");
    expect(form.querySelector("#message").value).not.toBe("");
    expect(removeItem).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);

    expect(removeItem).toHaveBeenCalledExactlyOnceWith(CONTACT_FORM.messageStorageKey);
    CONTACT_FORM.requiredFields.forEach((id) => {
      expect(form.querySelector(`#${id}`).value).toBe("");
    });
    expect(form.querySelector("#consent").checked).toBe(false);
    expect(form.querySelector("#messageCounter").textContent).toBe(`0/${CONTACT_FORM.maxMessageLength}`);
    expect(form.getAttribute("aria-busy")).toBe("false");
    expect(status.textContent).toBe("Dziękujemy! Wiadomość została wysłana.");
    expect(status.classList.contains("ok")).toBe(true);
    expect(status.classList.contains("err")).toBe(false);
    expect(submitBtn.classList.contains("sending")).toBe(false);
    expect(submitBtn.classList.contains("sent")).toBe(true);
    expect(submitBtn.textContent).toBe("Wysłano ✓");
    expect(submitBtn.disabled).toBe(true);
    expect(requestSubmit).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
