/**
 * Parse email and phone from job description text.
 * Used for display in job listings when contact info is embedded.
 */

const EMAIL_REGEX =
  /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/g;

// International phone formats: +1 234 567 8900, (123) 456-7890, 123-456-7890, etc.
const PHONE_REGEX =
  /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}(?:[-.\s]?\d{2,4})?|\+\d{10,15}/g;

export type ParsedContact = {
  email?: string;
  phone?: string;
};

/**
 * Extract first email and phone from text.
 * Returns the first valid match of each to avoid noise.
 */
export function parseContactFromText(text: string | undefined): ParsedContact {
  const result: ParsedContact = {};
  if (!text?.trim()) return result;

  const emailMatch = text.match(EMAIL_REGEX);
  if (emailMatch?.length) {
    const valid = emailMatch.filter(
      (e) =>
        !e.endsWith(".png") &&
        !e.endsWith(".jpg") &&
        !e.endsWith(".gif") &&
        e.length < 80
    );
    if (valid[0]) result.email = valid[0];
  }

  const phoneMatch = text.match(PHONE_REGEX);
  if (phoneMatch?.length) {
    const valid = phoneMatch.filter((p) => {
      const digits = p.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    });
    if (valid[0]) result.phone = valid[0].trim();
  }

  return result;
}
