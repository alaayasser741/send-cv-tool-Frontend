import { useEffect, useState } from "react";

import { STORAGE_KEYS } from "@/config/storage";
import { getStorageItem, removeStorageItem, setStorageItem } from "@/lib/storage";
import type { LogItem } from "@/types/campaign";

export function useLogHistory() {
  const [logs, setLogs] = useState<LogItem[]>(() => {
    const savedLogs = getStorageItem(STORAGE_KEYS.logs);
    if (!savedLogs) return [];

    try {
      const parsed = JSON.parse(savedLogs);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (value): value is LogItem =>
            Boolean(value) &&
            typeof value === "object" &&
            typeof value.id === "string" &&
            typeof value.email === "string" &&
            typeof value.message === "string" &&
            typeof value.status === "string" &&
            typeof value.createdAt === "string"
        );
      }
    } catch {
      return [];
    }

    return [];
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.logs, JSON.stringify(logs));
  }, [logs]);

  const prependLogs = (nextLogs: LogItem[]) => {
    setLogs((current) => [...nextLogs, ...current].slice(0, 50));
  };

  const clearLogs = () => {
    setLogs([]);
    removeStorageItem(STORAGE_KEYS.logs);
  };

  return {
    logs,
    prependLogs,
    clearLogs,
  };
}
