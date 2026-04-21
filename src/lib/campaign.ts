import { MAX_DELAY_SECONDS, MIN_DELAY_SECONDS } from "@/config/campaign";

export function clampBatchSize(value: number) {
  if (Number.isNaN(value)) return 2;
  return Math.max(1, Math.min(5, value));
}

export function clampDelaySeconds(value: number) {
  if (Number.isNaN(value)) return 4;
  return Math.max(MIN_DELAY_SECONDS, Math.min(MAX_DELAY_SECONDS, value));
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
