import { Globe, Mail, Moon, SunMedium } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CampaignCopy, Theme } from "@/types/campaign";

type DashboardHeaderProps = {
  copy: CampaignCopy;
  emailsCount: number;
  statusLabel: string;
  theme: Theme;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
};

export function DashboardHeader({
  copy,
  emailsCount,
  statusLabel,
  theme,
  onToggleTheme,
  onToggleLanguage,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{statusLabel}</Badge>
          <Badge variant="secondary">
            <Mail data-icon="inline-start" />
            {emailsCount} {copy.batchUnit}
          </Badge>
        </div>
        <div className="max-w-2xl flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            {copy.title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {copy.subtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
        {/* <Badge variant="outline">{copy.badgeTheme}</Badge> */}
        <Button onClick={onToggleTheme} variant="outline" size="sm" type="button" className="cursor-pointer">
          {theme === "dark" ? (
            <SunMedium data-icon="inline-start" />
          ) : (
            <Moon data-icon="inline-start" />
          )}
          {theme === "dark" ? "Light" : "Dark"}
        </Button>
        {/* <Badge variant="outline">{copy.badgeLanguage}</Badge> */}
        <Button onClick={onToggleLanguage} variant="outline" size="sm" type="button" className="cursor-pointer">
          <Globe data-icon="inline-start" />
          {copy.langLabel}
        </Button>
      </div>
    </div>
  );
}
