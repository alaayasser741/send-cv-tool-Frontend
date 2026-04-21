import { useEffect, useMemo, useState } from "react";

import { STORAGE_KEYS } from "@/config/storage";
import { parseRecipientInput, stringifyRecipients } from "@/lib/recipients";
import { getStorageItem, setStorageItem } from "@/lib/storage";

type UseRecipientEditorArgs = {
  defaultRecipients: string[];
};

export function useRecipientEditor({ defaultRecipients }: UseRecipientEditorArgs) {
  const [recipientInput, setRecipientInput] = useState<string>(() => {
    const savedInput = getStorageItem(STORAGE_KEYS.recipientsInput);
    if (savedInput !== null) return savedInput;

    const savedRecipients = getStorageItem(STORAGE_KEYS.recipients);
    if (savedRecipients) {
      try {
        const parsed = JSON.parse(savedRecipients);
        if (Array.isArray(parsed)) {
          const normalizedRecipients = parsed.filter(
            (value): value is string => typeof value === "string"
          );

          if (normalizedRecipients.length > 0) {
            return stringifyRecipients(normalizedRecipients);
          }
        }
      } catch {
        return stringifyRecipients(defaultRecipients);
      }
    }

    return stringifyRecipients(defaultRecipients);
  });

  const recipients = useMemo(() => parseRecipientInput(recipientInput), [recipientInput]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.recipientsInput, recipientInput);
    setStorageItem(STORAGE_KEYS.recipients, JSON.stringify(recipients));
  }, [recipientInput, recipients]);

  return {
    recipientInput,
    setRecipientInput,
    recipients,
  };
}
