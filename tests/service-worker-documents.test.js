// @vitest-environment node

import { readFileSync } from "node:fs";
import { URL } from "node:url";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const REVISION = "document-tests";
const workerSource = readFileSync(new URL("../sw.template.js", import.meta.url), "utf8")
  .replace("__SW_REVISION__", REVISION)
  .replace("__PRECACHE_ASSETS__", JSON.stringify(["./offline.html", "./index.html"]));

const deferred = () => {
  let resolve;
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
};

const createWorker = () => {
  const listeners = new Map();
  const request = {
    url: "https://axiom.example/services/budowa.html",
    method: "GET",
    destination: "document",
  };
  const cachedResponses = new Map();
  const fetch = vi.fn().mockRejectedValue(new Error("Network unavailable"));
  const put = vi.fn().mockResolvedValue(undefined);
  const caches = {
    open: vi.fn().mockResolvedValue({ put }),
    match: vi.fn(async (key) => cachedResponses.get(key)),
  };

  // Each scenario owns a fresh VM and mocks; no host globals, real fetch or
  // persistent Cache Storage are exposed. Install/activate are never dispatched.
  runInNewContext(workerSource, {
    URL,
    fetch,
    caches,
    self: {
      location: { origin: "https://axiom.example" },
      addEventListener: (type, listener) => listeners.set(type, listener),
    },
  }, { filename: "sw.template.js" });

  const dispatchDocument = () => {
    const respondWith = vi.fn();
    listeners.get("fetch")({ request, respondWith });
    expect(respondWith).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledExactlyOnceWith(request);
    expect(caches.match).not.toHaveBeenCalled();
    return respondWith.mock.calls[0][0];
  };

  return { request, fetch, caches, put, cachedResponses, dispatchDocument };
};

describe("service worker document responses", () => {
  it("returns HTTP 200 from the network and asynchronously caches its clone in the revision-specific HTML cache", async () => {
    const worker = createWorker();
    const copy = { body: "Cloned network document" };
    const response = { status: 200, clone: vi.fn(() => copy) };
    worker.fetch.mockResolvedValueOnce(response);

    // The production handler does not await caches.open()/put(). Keep open
    // pending until after the response assertion, then observe the actual write.
    const opening = deferred();
    const written = deferred();
    worker.caches.open.mockReturnValueOnce(opening.promise);
    worker.put.mockImplementation(async () => written.resolve());

    expect(await worker.dispatchDocument()).toBe(response);
    expect(response.clone).toHaveBeenCalledTimes(1);
    expect(worker.caches.open).toHaveBeenCalledExactlyOnceWith(`html-pages-${REVISION}`);
    expect(worker.put).not.toHaveBeenCalled();

    opening.resolve({ put: worker.put });
    await written.promise;

    expect(worker.put).toHaveBeenCalledExactlyOnceWith(worker.request, copy);
    expect(worker.put.mock.calls[0][0]).toBe(worker.request);
    expect(worker.put.mock.calls[0][1]).toBe(copy);
    expect(worker.caches.match).not.toHaveBeenCalled();
  });

  it("returns an HTTP non-200 response without cloning, writing to cache or selecting an offline fallback", async () => {
    const worker = createWorker();
    const response = { status: 503, clone: vi.fn() };
    worker.fetch.mockResolvedValueOnce(response);
    worker.cachedResponses.set("./offline.html", { body: "Available offline page" });

    expect(await worker.dispatchDocument()).toBe(response);
    expect(response.clone).not.toHaveBeenCalled();
    expect(worker.caches.open).not.toHaveBeenCalled();
    expect(worker.put).not.toHaveBeenCalled();
    expect(worker.caches.match).not.toHaveBeenCalled();
  });

  it.each([
    { name: "requested document", requested: true, offline: true, lookups: ["request"] },
    { name: "offline page", requested: false, offline: true, lookups: ["request", "./offline.html"] },
    { name: "index page", requested: false, offline: false, lookups: ["request", "./offline.html", "./index.html"] },
  ])("returns the $name after network rejection, respecting fallback precedence", async ({ requested, offline, lookups }) => {
    const worker = createWorker();
    const requestedResponse = { body: "Requested cached document" };
    const offlineResponse = { body: "Offline page" };
    const indexResponse = { body: "Index page" };
    if (requested) worker.cachedResponses.set(worker.request, requestedResponse);
    if (offline) worker.cachedResponses.set("./offline.html", offlineResponse);
    worker.cachedResponses.set("./index.html", indexResponse);

    const expected = requested ? requestedResponse : offline ? offlineResponse : indexResponse;
    expect(await worker.dispatchDocument()).toBe(expected);
    expect(worker.caches.match.mock.calls).toEqual(
      lookups.map((key) => [key === "request" ? worker.request : key]),
    );
    expect(worker.caches.match.mock.calls[0][0]).toBe(worker.request);
    expect(worker.caches.open).not.toHaveBeenCalled();
    expect(worker.put).not.toHaveBeenCalled();
  });
});
