import { CheckCircle2, LoaderCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { CampaignCopy, LogItem, MetricItem } from "@/types/campaign";

type StatusPanelProps = {
  copy: CampaignCopy;
  metrics: MetricItem[];
  loading: boolean;
  progress: number;
  completedCount: number;
  emailsCount: number;
  currentBatch: number;
  totalBatches: number;
  logs: LogItem[];
};

export function StatusPanel({
  copy,
  metrics,
  loading,
  progress,
  completedCount,
  emailsCount,
  currentBatch,
  totalBatches,
  logs,
}: StatusPanelProps) {
  const completionRatio =
    emailsCount === 0 ? 0 : Math.round((completedCount / emailsCount) * 100);

  return (
    <Card className="glass-panel border-white/30 bg-card/80 backdrop-blur-xl">
      <CardHeader className="gap-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="text-primary" />
          {copy.liveStatus}
        </CardTitle>
        <CardDescription>{copy.liveStatusText}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-3 md:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-2 break-words text-lg font-semibold tracking-[-0.03em]">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-[1.75rem] border border-border/70 bg-background/75 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{copy.progressTitle}</p>
              <p className="text-sm text-muted-foreground">
                {completedCount} {copy.of} {emailsCount}
              </p>
            </div>
            <p className="text-3xl font-semibold tracking-[-0.05em]">{completionRatio}%</p>
          </div>
          <Progress className="mt-4 h-2.5" value={progress} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {copy.currentBatch}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {currentBatch || 0} / {totalBatches || 0}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {copy.completed}
              </p>
              <p className="mt-2 text-lg font-semibold">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[1.75rem] border border-border/70 bg-background/70 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium">{copy.activity}</p>
              <p className="text-sm text-muted-foreground">{copy.activityDescription}</p>
            </div>
            {loading ? (
              <Badge variant="secondary">
                <LoaderCircle className="animate-spin" data-icon="inline-start" />
                {copy.statusSending}
              </Badge>
            ) : (
              <Badge variant="outline">
                <CheckCircle2 data-icon="inline-start" />
                {copy.statusReady}
              </Badge>
            )}
          </div>

          <Separator />

          {loading && logs.length === 0 ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
            </div>
          ) : logs.length > 0 ? (
            <div className="flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={`${log.email}-${log.message}`}
                  className={`rounded-2xl border p-4 text-sm transition-colors ${
                    log.status === "success"
                      ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300"
                      : "border-rose-500/20 bg-rose-500/8 text-rose-700 dark:text-rose-300"
                  }`}
                >
                  {log.message}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-6 text-sm text-muted-foreground">
              {copy.emptyLogs}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
