import { LoaderCircle, Send } from "lucide-react";

import { CV_LINK } from "@/config/campaign";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CampaignCopy } from "@/types/campaign";

type ControlPanelProps = {
  copy: CampaignCopy;
  batchSize: number;
  delaySeconds: number;
  loading: boolean;
  recipientsCount: number;
  recipientInput: string;
  onBatchSizeChange: (value: string) => void;
  onDelaySecondsChange: (value: string) => void;
  onRecipientInputChange: (value: string) => void;
  onSend: () => void;
};

export function ControlPanel({
  copy,
  batchSize,
  delaySeconds,
  loading,
  recipientsCount,
  recipientInput,
  onBatchSizeChange,
  onDelaySecondsChange,
  onRecipientInputChange,
  onSend,
}: ControlPanelProps) {
  return (
    <Card className="glass-panel border-white/30 bg-card/85 backdrop-blur-xl">
      <CardHeader className="gap-3">
        <CardTitle>{copy.cardTitle}</CardTitle>
        <CardDescription>{copy.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="batch-size">
            {copy.inputLabel}
          </label>
          <Input
            id="batch-size"
            type="number"
            min={1}
            max={5}
            value={batchSize}
            onChange={(event) => onBatchSizeChange(event.target.value)}
            disabled={loading}
            aria-invalid={batchSize < 1 || batchSize > 5}
            className="h-11 rounded-2xl bg-background/70 text-base"
          />
          <p className="text-sm text-muted-foreground">{copy.inputHint}</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="delay-seconds">
            {copy.delayLabel}
          </label>
          <Input
            id="delay-seconds"
            type="number"
            min={0}
            max={120}
            value={delaySeconds}
            onChange={(event) => onDelaySecondsChange(event.target.value)}
            disabled={loading}
            className="h-11 rounded-2xl bg-background/70 text-base"
          />
          <p className="text-sm text-muted-foreground">{copy.delayHint}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {copy.recipientList}
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground/90">
              {copy.recipientListText}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {copy.parsedRecipients}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              {recipientsCount}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="recipient-input">
            {copy.recipientEditorLabel}
          </label>
          <Textarea
            id="recipient-input"
            value={recipientInput}
            onChange={(event) => onRecipientInputChange(event.target.value)}
            placeholder={copy.recipientEditorPlaceholder}
            className="min-h-44 bg-background/70"
            disabled={loading}
          />
          <p className="text-sm text-muted-foreground">{copy.recipientEditorHint}</p>
        </div>

        <div className="rounded-[1.75rem] border border-border/70 bg-linear-to-br from-background via-background to-muted/40 p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Alaa Abdullah</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            {copy.candidateRole}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {copy.candidateSummary}
          </p>
          <a
            className="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
            href={CV_LINK}
            target="_blank"
            rel="noreferrer"
          >
            {copy.cvLink}
          </a>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3 border-t border-border/60 bg-transparent">
        <Button
          onClick={onSend}
          disabled={loading || recipientsCount === 0}
          className="h-11 rounded-2xl shadow-lg shadow-primary/20"
          size="lg"
          type="button"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" data-icon="inline-start" />
          ) : (
            <Send data-icon="inline-start" />
          )}
          {loading ? copy.sending : copy.start}
        </Button>
        <p className="text-center text-xs leading-5 text-muted-foreground">
          {recipientsCount === 0 ? copy.noRecipients : copy.cookieNotice}
        </p>
      </CardFooter>
    </Card>
  );
}
