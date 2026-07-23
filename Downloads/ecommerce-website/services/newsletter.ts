"use server";

/**
 * Newsletter subscription — Next.js Server Action.
 *
 * This currently just validates and accepts the submission; it does not
 * yet call an email service provider. Wire it up when the studio picks
 * one (Klaviyo is already listed as a planned integration in the tech
 * stack) by replacing the body below with an authenticated API call —
 * the function signature and the client form in
 * `components/home/newsletter-signup.tsx` won't need to change.
 */
export async function subscribeToNewsletter(
  email: string
): Promise<{ success: boolean; message: string }> {
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail) {
    return { success: false, message: "Please enter a valid email address." };
  }

  // TODO(Phase 9 / CMS & integrations): forward `email` to Klaviyo (or the
  // chosen ESP) here, e.g.:
  //   await klaviyoClient.lists.subscribe(NEWSLETTER_LIST_ID, { email });
  // For now, subscriptions are accepted but not persisted anywhere.

  return {
    success: true,
    message: "You're on the list — thank you for subscribing.",
  };
}
