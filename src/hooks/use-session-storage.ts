import { useState, useEffect, useCallback } from "react";

export default function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch {}
  }, [key, storedValue]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.storageArea === sessionStorage && e.key === key) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, initialValue]);

  const removeItem = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
    } catch {}
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setStoredValue, removeItem];
}
