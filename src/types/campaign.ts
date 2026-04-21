export type Theme = "light" | "dark";
export type Language = "en" | "ar";
export type LogStatus = "success" | "error";

export type LogItem = {
  id: string;
  email: string;
  message: string;
  status: LogStatus;
  createdAt: string;
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
  delayLabel: string;
  delayHint: string;
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
  recipientEditorLabel: string;
  recipientEditorHint: string;
  recipientEditorPlaceholder: string;
  parsedRecipients: string;
  clearHistory: string;
  historyCleared: string;
  noRecipients: string;
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
