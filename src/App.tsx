import { useMemo } from "react";

import { SEND_ENDPOINT } from "@/config/campaign";
import { useEmailCampaign } from "@/hooks/use-email-campaign";
import { useLogHistory } from "@/hooks/use-log-history";
import { usePreferences } from "@/hooks/use-preferences";
import { useRecipientEditor } from "@/hooks/use-recipient-editor";
import { messages } from "@/i18n";
import { clampBatchSize, clampDelaySeconds } from "@/lib/campaign";
import { defaultRecipients } from "@/data/recipients";
import { AnimatedBackground } from "@/components/dashboard/animated-background";
import { ControlPanel } from "@/components/dashboard/control-panel";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatusPanel } from "@/components/dashboard/status-panel";

export default function App() {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    batchSize,
    setBatchSize,
    delaySeconds,
    setDelaySeconds,
  } = usePreferences();
  const { recipientInput, setRecipientInput, recipients } = useRecipientEditor({
    defaultRecipients,
  });
  const { logs, prependLogs, clearLogs } = useLogHistory();

  const copy = messages[language];

  const {
    loading,
    progress,
    completedCount,
    currentBatch,
    totalBatches,
    sendEmails,
  } = useEmailCampaign({
    batchSize,
    delaySeconds,
    copy,
    recipients,
    prependLogs,
  });

  const statusLabel = loading ? copy.statusSending : copy.statusReady;

  const metrics = useMemo(
    () => [
      { label: copy.totalRecipients, value: String(recipients.length).padStart(2, "0") },
      { label: copy.activeEndpoint, value: SEND_ENDPOINT.replace(/^https?:\/\//, "") },
      { label: copy.delayWindow, value: `${delaySeconds} ${copy.seconds}` },
    ],
    [
      copy.activeEndpoint,
      copy.delayWindow,
      copy.seconds,
      copy.totalRecipients,
      delaySeconds,
      recipients.length,
    ]
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

  const handleDelaySecondsChange = (value: string) => {
    setDelaySeconds(clampDelaySeconds(Number(value)));
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
            onClearHistory={clearLogs}
          />

          <ControlPanel
            copy={copy}
            batchSize={batchSize}
            delaySeconds={delaySeconds}
            loading={loading}
            recipientsCount={recipients.length}
            recipientInput={recipientInput}
            onBatchSizeChange={handleBatchSizeChange}
            onDelaySecondsChange={handleDelaySecondsChange}
            onRecipientInputChange={setRecipientInput}
            onSend={sendEmails}
          />
        </section>
      </div>
    </main>
  );
}
