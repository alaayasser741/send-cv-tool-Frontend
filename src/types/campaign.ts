export type Theme = "light" | "dark";
export type Language = "en" | "ar";
export type LogStatus = "success" | "error";

export type LogItem = {
  email: string;
  message: string;
  status: LogStatus;
};

export type CampaignCopy = {
  langLabel: string;
  statusReady: string;
  statusSending: string;
  badgeTheme: string;
  badgeLanguage: string;
  title: string;
  subtitle: string;
  cardTitle: string;
  cardDescription: string;
  inputLabel: string;
  inputHint: string;
  totalRecipients: string;
  activeEndpoint: string;
  delayWindow: string;
  start: string;
  sending: string;
  progressTitle: string;
  currentBatch: string;
  completed: string;
  batches: string;
  activity: string;
  activityDescription: string;
  emptyLogs: string;
  liveStatus: string;
  liveStatusText: string;
  recipientList: string;
  recipientListText: string;
  batchUnit: string;
  of: string;
  seconds: string;
  success: string;
  failure: string;
  unknownError: string;
  cvLink: string;
  cookieNotice: string;
  candidateRole: string;
  candidateSummary: string;
};

export type MetricItem = {
  label: string;
  value: string;
};
