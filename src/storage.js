// Claude Artifacts expose `window.storage`. A normal website does not.
// This shim keeps the same async API and stores everything locally in the browser.

const PREFIX = "tomer-dayboard:";

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const value = window.localStorage.getItem(PREFIX + key);
      return value === null ? null : { key, value };
    },

    async set(key, value) {
      const storedValue = typeof value === "string" ? value : JSON.stringify(value);
      window.localStorage.setItem(PREFIX + key, storedValue);
      return { key, value: storedValue };
    },

    async delete(key) {
      window.localStorage.removeItem(PREFIX + key);
      return { key };
    },
  };
}
