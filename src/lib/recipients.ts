const EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

export function parseRecipientInput(input: string) {
  const matches = input.match(EMAIL_PATTERN) ?? [];
  const uniqueEmails = Array.from(
    new Set(matches.map((email) => email.trim().toLowerCase()))
  );

  return uniqueEmails;
}

export function stringifyRecipients(recipients: string[]) {
  return recipients.join("\n");
}
