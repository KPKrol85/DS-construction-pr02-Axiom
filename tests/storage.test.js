import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { safeGetItem, safeRemoveItem, safeSetItem } from "../js/utils/storage.js";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("best-effort storage failures", () => {
  it("returns null when reading storage throws", () => {
    const getItem = vi.spyOn(Object.getPrototypeOf(localStorage), "getItem").mockImplementation(() => {
      throw new Error("Storage read denied");
    });

    expect(safeGetItem("draft")).toBeNull();
    expect(getItem).toHaveBeenCalledExactlyOnceWith("draft");
  });

  it("does not propagate a storage write exception", () => {
    const setItem = vi.spyOn(Object.getPrototypeOf(localStorage), "setItem").mockImplementation(() => {
      throw new Error("Storage write denied");
    });

    expect(() => safeSetItem("draft", "message")).not.toThrow();
    expect(setItem).toHaveBeenCalledExactlyOnceWith("draft", "message");
  });

  it("does not propagate a storage removal exception", () => {
    const removeItem = vi.spyOn(Object.getPrototypeOf(localStorage), "removeItem").mockImplementation(() => {
      throw new Error("Storage removal denied");
    });

    expect(() => safeRemoveItem("draft")).not.toThrow();
    expect(removeItem).toHaveBeenCalledExactlyOnceWith("draft");
  });
});
