import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const source = readFileSync("js/offline.js", "utf8");
const destination = "https://axiom.example/services/budowa-domow.html?ref=menu#zakres";

const setup = () => {
  const page = document.implementation.createHTMLDocument();
  page.body.innerHTML = '<button id="retryBtn" type="button">Spróbuj ponownie</button><p id="netStatus" aria-live="polite"></p>';
  const events = document.createElement("div");
  const reload = vi.fn();
  const fetch = vi.fn().mockRejectedValue(new Error("Offline"));

  runInNewContext(source, {
    document: page,
    fetch,
    AbortController: window.AbortController,
    window: {
      addEventListener: events.addEventListener.bind(events),
      location: { href: destination, reload },
      setTimeout: window.setTimeout,
      clearTimeout: window.clearTimeout,
    },
  });

  return {
    page,
    fetch,
    reload,
    online: () => events.dispatchEvent(new Event("online")),
    button: page.getElementById("retryBtn"),
    status: page.getElementById("netStatus"),
  };
};

describe("offline recovery", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("waits for the network, coalesces online events and reloads once for a genuine HTTP 404", async () => {
    const { fetch, online, reload, status } = setup();
    fetch.mockRejectedValueOnce(new Error("Connection is still down"))
      .mockResolvedValueOnce({ ok: false, status: 404 });

    online();
    online();
    expect(status.textContent).toMatch(/Sprawdzam/);
    expect(fetch).toHaveBeenCalledExactlyOnceWith(destination, expect.objectContaining({
      method: "HEAD",
      cache: "no-store",
    }));
    expect(reload).not.toHaveBeenCalled();

    await vi.runAllTimersAsync();
    online();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(status.textContent).toMatch(/Połączenie przywrócone/);
  });

  it("stays on the page when the server is unavailable and leaves manual retry working", async () => {
    const { button, fetch, online, reload, status } = setup();
    fetch.mockResolvedValue({ ok: false, status: 503 });

    online();
    await vi.runAllTimersAsync();
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(reload).not.toHaveBeenCalled();
    expect(status.textContent).toMatch(/Nie udało się połączyć/);

    button.click();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("leaves Escape to the mobile menu and avoids a second reload during manual retry", async () => {
    const { button, fetch, online, page, reload } = setup();
    fetch.mockResolvedValueOnce({ ok: true, status: 200 });

    page.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(reload).not.toHaveBeenCalled();

    online();
    button.click();
    await vi.runAllTimersAsync();
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
