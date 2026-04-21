export function clampBatchSize(value: number) {
  if (Number.isNaN(value)) return 2;
  return Math.max(1, Math.min(5, value));
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
