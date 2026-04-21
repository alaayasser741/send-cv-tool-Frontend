import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Globe,
  LoaderCircle,
  Mail,
  Moon,
  Send,
  Sparkles,
  SunMedium,
} from "lucide-react";

import { saudiArabia } from "../utils/constant";
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getCookie, setCookie } from "@/lib/cookies";

type Theme = "light" | "dark";
type Language = "en" | "ar";
type LogStatus = "success" | "error";

type LogItem = {
  email: string;
  message: string;
  status: LogStatus;
};

const emails = saudiArabia;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const COOKIE_KEYS = {
  theme: "send-cv-theme",
  language: "send-cv-language",
  batchSize: "send-cv-batch-size",
} as const;

const emailHTML = `
  <p>Application for Frontend Developer (ReactJS & Next.js) - Alaa Abdullah</p>
  <p>Hello,</p>
  <p>
    I am writing to express my strong interest in the Frontend Developer position.
    With a Bachelor's degree in Computer and Information Science from Mansoura University
    and around 3 years of hands-on experience in frontend development, I have grown into
    a solid mid-level developer with a strong command of modern web technologies, especially React.js and Next.js.
  </p>

  <p>Throughout my career, I have worked on multiple real-world projects where I contributed to building, optimizing, and maintaining responsive, high-quality web applications. My experience includes:</p>

  <ul>
    <li>Strong understanding of React.js and component-based architecture.</li>
    <li>Experience with state management (Context API, Redux).</li>
    <li>Proficiency in modern JavaScript (ES6+).</li>
    <li>Integration with RESTful APIs.</li>
    <li>Writing clean, maintainable, and scalable code.</li>
    <li>Using Git and collaborative workflows.</li>
    <li>Building responsive and performance-optimized UI.</li>
  </ul>

  <p>I have taken ownership of features end-to-end, improved existing systems, and delivered user-focused solutions across different projects. Working on various projects helped me adapt quickly, solve real-world problems, and continuously improve my development skills.</p>

  <p>You can find my CV here: <a href="https://drive.google.com/file/d/1Vn7caRA43llK94r64hXkhU3WAlNDY-Qb/view?usp=drive_link" target="_blank" rel="noreferrer">View My CV</a></p>

  <p>I am eager to contribute to your team, add value through clean and efficient code, and continue growing within a professional environment.</p>

  <p>Thank you for your time and consideration. I look forward to hearing from you.</p>

  <p>Best regards,<br/>
  Alaa Abdullah<br/>
  +20 155 677 4943<br/>
  <a href="mailto:alaayasser2018@gmail.com">alaayasser2018@gmail.com</a></p>
`;

const content = {
  en: {
    langLabel: "AR",
    statusReady: "Ready to send",
    statusSending: "Sending now",
    badgeTheme: "Theme",
    badgeLanguage: "Language",
    title: "Send CV campaign",
    subtitle:
      "A cleaner outreach dashboard with persistent preferences, bilingual UI, and a more informative sending flow.",
    cardTitle: "Campaign control",
    cardDescription:
      "Tune batch size, review live status, and launch the send job from one focused panel.",
    inputLabel: "Emails per batch",
    inputHint: "Recommended range: 1 to 5 recipients per request.",
    totalRecipients: "Recipients",
    activeEndpoint: "API endpoint",
    delayWindow: "Delay window",
    start: "Send CV",
    sending: "Sending...",
    progressTitle: "Delivery progress",
    currentBatch: "Current batch",
    completed: "Completed",
    batches: "Batches",
    activity: "Recent activity",
    activityDescription: "Latest delivery results from the current session.",
    emptyLogs: "No activity yet. Start a run to populate live delivery updates.",
    liveStatus: "Live send status",
    liveStatusText:
      "The tool sends in controlled batches with a short cooldown between each request to reduce spam risk.",
    recipientList: "Target list",
    recipientListText: "Using the current Saudi Arabia list configured in the project.",
    batchUnit: "emails",
    of: "of",
    seconds: "seconds",
    success: "Sent to",
    failure: "Failed",
    unknownError: "Unknown error",
    cvLink: "Open CV",
  },
  ar: {
    langLabel: "EN",
    statusReady: "جاهز للإرسال",
    statusSending: "جاري الإرسال",
    badgeTheme: "المظهر",
    badgeLanguage: "اللغة",
    title: "لوحة إرسال السيرة الذاتية",
    subtitle:
      "واجهة أنظف مع حفظ التفضيلات، دعم عربي وإنجليزي، وتجربة إرسال أوضح أثناء التنفيذ.",
    cardTitle: "التحكم في الحملة",
    cardDescription:
      "حدد حجم الدفعة، راقب الحالة المباشرة، وابدأ الإرسال من لوحة واحدة واضحة.",
    inputLabel: "عدد الإيميلات في الدفعة",
    inputHint: "المدى المقترح: من 1 إلى 5 مستلمين لكل طلب.",
    totalRecipients: "عدد المستلمين",
    activeEndpoint: "واجهة الإرسال",
    delayWindow: "مدة الانتظار",
    start: "إرسال السيرة الذاتية",
    sending: "جاري الإرسال...",
    progressTitle: "تقدم الإرسال",
    currentBatch: "الدفعة الحالية",
    completed: "تم التنفيذ",
    batches: "الدفعات",
    activity: "آخر العمليات",
    activityDescription: "أحدث نتائج الإرسال في الجلسة الحالية.",
    emptyLogs: "لا توجد عمليات بعد. ابدأ الإرسال لعرض النتائج المباشرة.",
    liveStatus: "الحالة المباشرة",
    liveStatusText:
      "يتم الإرسال على دفعات مع انتظار قصير بين كل طلب لتقليل احتمالية اعتباره سبام.",
    recipientList: "قائمة الإرسال",
    recipientListText: "يتم استخدام القائمة الحالية الخاصة بالسعودية الموجودة داخل المشروع.",
    batchUnit: "إيميلات",
    of: "من",
    seconds: "ثوان",
    success: "تم الإرسال إلى",
    failure: "فشل",
    unknownError: "خطأ غير معروف",
    cvLink: "فتح السيرة الذاتية",
  },
} as const;

function clampBatchSize(value: number) {
  if (Number.isNaN(value)) return 2;
  return Math.max(1, Math.min(5, value));
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = getCookie(COOKIE_KEYS.theme);
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "dark";
  });
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = getCookie(COOKIE_KEYS.language);
    return savedLanguage === "ar" || savedLanguage === "en" ? savedLanguage : "en";
  });
  const [batchSize, setBatchSize] = useState<number>(() =>
    clampBatchSize(Number(getCookie(COOKIE_KEYS.batchSize) ?? "2"))
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);

  const delayMs = 4000;
  const copy = content[language];
  const totalBatches = Math.ceil(emails.length / batchSize);
  const delaySeconds = delayMs / 1000;
  const statusLabel = loading ? copy.statusSending : copy.statusReady;
  const completionRatio = emails.length === 0 ? 0 : Math.round((completedCount / emails.length) * 100);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
    setCookie(COOKIE_KEYS.theme, theme, COOKIE_MAX_AGE);
  }, [theme, language]);

  useEffect(() => {
    setCookie(COOKIE_KEYS.language, language, COOKIE_MAX_AGE);
  }, [language]);

  useEffect(() => {
    setCookie(COOKIE_KEYS.batchSize, String(batchSize), COOKIE_MAX_AGE);
  }, [batchSize]);

  const metrics = useMemo(
    () => [
      { label: copy.totalRecipients, value: String(emails.length).padStart(2, "0") },
      { label: copy.activeEndpoint, value: "localhost:5000/send" },
      { label: copy.delayWindow, value: `${delaySeconds} ${copy.seconds}` },
    ],
    [copy.activeEndpoint, copy.delayWindow, copy.seconds, copy.totalRecipients, delaySeconds]
  );

  const handleBatchChange = (value: string) => {
    setBatchSize(clampBatchSize(Number(value)));
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const toggleLanguage = () => {
    setLanguage((current) => (current === "en" ? "ar" : "en"));
  };

  const sendEmails = async () => {
    if (loading) return;

    setLoading(true);
    setLogs([]);
    setProgress(0);
    setCompletedCount(0);
    setCurrentBatch(0);

    for (let index = 0; index < emails.length; index += batchSize) {
      const batch = emails.slice(index, index + batchSize);
      const batchNumber = Math.floor(index / batchSize) + 1;
      setCurrentBatch(batchNumber);

      const batchResults = await Promise.all(
        batch.map(async (email) => {
          try {
            const response = await fetch("http://localhost:5000/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: email,
                subject: "Application for Frontend Developer - Alaa Abdullah",
                html: emailHTML,
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

      const nextCompletedCount = Math.min(index + batch.length, emails.length);
      setCompletedCount(nextCompletedCount);
      setProgress(Math.round((nextCompletedCount / emails.length) * 100));

      if (index + batchSize < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    setLoading(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-10rem] size-80 rounded-full bg-[radial-gradient(circle,_rgba(14,165,233,0.24),_transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle,_rgba(245,158,11,0.18),_transparent_68%)]" />
        <div className="absolute right-[-8rem] top-[8rem] size-72 rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.22),_transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,_rgba(59,130,246,0.18),_transparent_70%)]" />
        <div className="grid-mask absolute inset-0 opacity-55 dark:opacity-35" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{statusLabel}</Badge>
              <Badge variant="secondary">
                <Mail data-icon="inline-start" />
                {emails.length} {copy.batchUnit}
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
            <Badge variant="outline">{copy.badgeTheme}</Badge>
            <Button onClick={toggleTheme} variant="outline" size="sm" type="button">
              {theme === "dark" ? (
                <SunMedium data-icon="inline-start" />
              ) : (
                <Moon data-icon="inline-start" />
              )}
              {theme === "dark" ? "Light" : "Dark"}
            </Button>
            <Badge variant="outline">{copy.badgeLanguage}</Badge>
            <Button onClick={toggleLanguage} variant="outline" size="sm" type="button">
              <Globe data-icon="inline-start" />
              {copy.langLabel}
            </Button>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
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
                      {completedCount} {copy.of} {emails.length}
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
                  onChange={(event) => handleBatchChange(event.target.value)}
                  disabled={loading}
                  aria-invalid={batchSize < 1 || batchSize > 5}
                  className="h-11 rounded-2xl bg-background/70 text-base"
                />
                <p className="text-sm text-muted-foreground">{copy.inputHint}</p>
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
                    {copy.batches}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    {totalBatches || 0}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-border/70 bg-linear-to-br from-background via-background to-muted/40 p-5 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">Alaa Abdullah</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Frontend Developer
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  React.js, Next.js, scalable UI delivery, and production-focused frontend work.
                </p>
                <a
                  className="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                  href="https://drive.google.com/file/d/1Vn7caRA43llK94r64hXkhU3WAlNDY-Qb/view?usp=drive_link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.cvLink}
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-3 border-t border-border/60 bg-transparent">
              <Button
                onClick={sendEmails}
                disabled={loading}
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
                Cookies keep the selected theme, language, and batch size across visits.
              </p>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  );
}
