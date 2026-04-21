import { useMemo } from "react";

import { SEND_DELAY_MS, SEND_ENDPOINT } from "@/config/campaign";
import { recipients } from "@/data/recipients";
import { useEmailCampaign } from "@/hooks/use-email-campaign";
import { usePreferences } from "@/hooks/use-preferences";
import { messages } from "@/i18n";
import { clampBatchSize } from "@/lib/campaign";
import { AnimatedBackground } from "@/components/dashboard/animated-background";
import { ControlPanel } from "@/components/dashboard/control-panel";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatusPanel } from "@/components/dashboard/status-panel";

export default function App() {
  const { theme, setTheme, language, setLanguage, batchSize, setBatchSize } =
    usePreferences();

  const copy = messages[language];

  const {
    loading,
    progress,
    logs,
    completedCount,
    currentBatch,
    totalBatches,
    sendEmails,
  } = useEmailCampaign({
    batchSize,
    copy,
    recipients,
  });

  const delaySeconds = SEND_DELAY_MS / 1000;
  const statusLabel = loading ? copy.statusSending : copy.statusReady;

  const metrics = useMemo(
    () => [
      { label: copy.totalRecipients, value: String(recipients.length).padStart(2, "0") },
      { label: copy.activeEndpoint, value: SEND_ENDPOINT.replace(/^https?:\/\//, "") },
      { label: copy.delayWindow, value: `${delaySeconds} ${copy.seconds}` },
    ],
    [copy.activeEndpoint, copy.delayWindow, copy.seconds, copy.totalRecipients, delaySeconds]
  );

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const toggleLanguage = () => {
    setLanguage((current) => (current === "en" ? "ar" : "en"));
  };

  const handleBatchSizeChange = (value: string) => {
    setBatchSize(clampBatchSize(Number(value)));
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AnimatedBackground />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <DashboardHeader
          copy={copy}
          emailsCount={recipients.length}
          statusLabel={statusLabel}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleLanguage={toggleLanguage}
        />

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <StatusPanel
            copy={copy}
            metrics={metrics}
            loading={loading}
            progress={progress}
            completedCount={completedCount}
            emailsCount={recipients.length}
            currentBatch={currentBatch}
            totalBatches={totalBatches}
            logs={logs}
          />

          <ControlPanel
            copy={copy}
            batchSize={batchSize}
            loading={loading}
            totalBatches={totalBatches}
            onBatchSizeChange={handleBatchSizeChange}
            onSend={sendEmails}
          />
        </section>
      </div>
    </main>
  );
}
