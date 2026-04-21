import { useMemo, useState } from "react";

import {
  EMAIL_HTML,
  EMAIL_SUBJECT,
  SEND_DELAY_MS,
  SEND_ENDPOINT,
} from "@/config/campaign";
import { wait } from "@/lib/campaign";
import type { CampaignCopy, LogItem } from "@/types/campaign";

type UseEmailCampaignArgs = {
  batchSize: number;
  copy: CampaignCopy;
  recipients: string[];
};

export function useEmailCampaign({
  batchSize,
  copy,
  recipients,
}: UseEmailCampaignArgs) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);

  const totalBatches = useMemo(
    () => Math.ceil(recipients.length / batchSize),
    [batchSize, recipients.length]
  );

  const sendEmails = async () => {
    if (loading) return;

    setLoading(true);
    setLogs([]);
    setProgress(0);
    setCompletedCount(0);
    setCurrentBatch(0);

    for (let index = 0; index < recipients.length; index += batchSize) {
      const batch = recipients.slice(index, index + batchSize);
      const batchNumber = Math.floor(index / batchSize) + 1;
      setCurrentBatch(batchNumber);

      const batchResults = await Promise.all(
        batch.map(async (email) => {
          try {
            const response = await fetch(SEND_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: email,
                subject: EMAIL_SUBJECT,
                html: EMAIL_HTML,
              }),
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            return {
              email,
              message: `${copy.success} ${email}`,
              status: "success" as const,
            };
          } catch (error) {
            const reason = error instanceof Error ? error.message : copy.unknownError;
            return {
              email,
              message: `${copy.failure}: ${email} (${reason})`,
              status: "error" as const,
            };
          }
        })
      );

      setLogs((current) => [...batchResults, ...current].slice(0, 12));

      const nextCompletedCount = Math.min(index + batch.length, recipients.length);
      setCompletedCount(nextCompletedCount);
      setProgress(Math.round((nextCompletedCount / recipients.length) * 100));

      if (index + batchSize < recipients.length) {
        await wait(SEND_DELAY_MS);
      }
    }

    setLoading(false);
  };

  return {
    loading,
    progress,
    logs,
    completedCount,
    currentBatch,
    totalBatches,
    sendEmails,
  };
}
