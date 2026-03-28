import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

function createStorageMock(): Storage {
  let store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store = new Map<string, string>();
    },
    getItem(key) {
      return store.get(key) ?? null;
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key) {
      store.delete(key);
    },
    setItem(key, value) {
      store.set(key, value);
    },
  };
}

Object.defineProperty(window, "localStorage", {
  value: createStorageMock(),
  configurable: true,
});

Object.defineProperty(globalThis, "localStorage", {
  value: window.localStorage,
  configurable: true,
});

afterEach(() => {
  cleanup();
});
