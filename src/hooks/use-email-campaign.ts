import { useMemo, useState } from "react";

import {
  EMAIL_HTML,
  EMAIL_SUBJECT,
  SEND_ENDPOINT,
} from "@/config/campaign";
import { wait } from "@/lib/campaign";
import type { CampaignCopy, LogItem } from "@/types/campaign";

type UseEmailCampaignArgs = {
  batchSize: number;
  delaySeconds: number;
  copy: CampaignCopy;
  recipients: string[];
  prependLogs: (logs: LogItem[]) => void;
};

export function useEmailCampaign({
  batchSize,
  delaySeconds,
  copy,
  recipients,
  prependLogs,
}: UseEmailCampaignArgs) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [nextBatchCountdown, setNextBatchCountdown] = useState<number | null>(null);

  const totalBatches = useMemo(
    () => Math.ceil(recipients.length / batchSize),
    [batchSize, recipients.length]
  );

  const sendEmails = async () => {
    if (loading) return;
    if (recipients.length === 0) return;

    setLoading(true);
    setProgress(0);
    setCompletedCount(0);
    setCurrentBatch(0);
    setNextBatchCountdown(null);

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
              id: crypto.randomUUID(),
              email,
              message: `${copy.success} ${email}`,
              status: "success" as const,
              createdAt: new Date().toISOString(),
            };
          } catch (error) {
            const reason = error instanceof Error ? error.message : copy.unknownError;
            return {
              id: crypto.randomUUID(),
              email,
              message: `${copy.failure}: ${email} (${reason})`,
              status: "error" as const,
              createdAt: new Date().toISOString(),
            };
          }
        })
      );

      prependLogs(batchResults);

      const nextCompletedCount = Math.min(index + batch.length, recipients.length);
      setCompletedCount(nextCompletedCount);
      setProgress(Math.round((nextCompletedCount / recipients.length) * 100));

      if (index + batchSize < recipients.length) {
        if (delaySeconds > 0) {
          setNextBatchCountdown(delaySeconds);

          await new Promise<void>((resolve) => {
            let remainingSeconds = delaySeconds;

            const intervalId = window.setInterval(() => {
              remainingSeconds -= 1;

              if (remainingSeconds <= 0) {
                window.clearInterval(intervalId);
                setNextBatchCountdown(null);
                resolve();
                return;
              }

              setNextBatchCountdown(remainingSeconds);
            }, 1000);
          });
        } else {
          await wait(0);
        }
      }
    }

    setLoading(false);
    setNextBatchCountdown(null);
  };

  return {
    loading,
    progress,
    completedCount,
    currentBatch,
    nextBatchCountdown,
    totalBatches,
    sendEmails,
  };
}
