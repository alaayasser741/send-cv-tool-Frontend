export function getStorageItem(key: string) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

export function removeStorageItem(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}
