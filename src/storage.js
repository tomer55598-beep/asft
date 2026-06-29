// Claude Artifacts expose `window.storage`. A normal website does not.
// This shim keeps the same async API and stores everything locally in the browser.
// It also avoids crashes on iPhone/Safari when localStorage is blocked or unavailable.

const PREFIX = "tomer-dayboard:";
const memoryStore = new Map();

function canUseLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const testKey = PREFIX + "__test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const localStorageAvailable = canUseLocalStorage();

function getRaw(key) {
  if (localStorageAvailable) {
    try {
      return window.localStorage.getItem(PREFIX + key);
    } catch (e) {
      return memoryStore.has(key) ? memoryStore.get(key) : null;
    }
  }
  return memoryStore.has(key) ? memoryStore.get(key) : null;
}

function setRaw(key, value) {
  if (localStorageAvailable) {
    try {
      window.localStorage.setItem(PREFIX + key, value);
      return;
    } catch (e) {
      // fall back to memory below
    }
  }
  memoryStore.set(key, value);
}

function removeRaw(key) {
  if (localStorageAvailable) {
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch (e) {
      // ignore and remove from memory below
    }
  }
  memoryStore.delete(key);
}

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const value = getRaw(key);
      return value === null ? null : { key, value };
    },

    async set(key, value) {
      const storedValue = typeof value === "string" ? value : JSON.stringify(value);
      setRaw(key, storedValue);
      return { key, value: storedValue };
    },

    async delete(key) {
      removeRaw(key);
      return { key };
    },
  };
}
