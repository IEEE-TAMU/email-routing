import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage } from 'mimetext';
import {
  Routes,
  DefaultRecipient,
  BlackholeRecipient,
  AuditRecipient,
} from './routes';

function normalizeEmailAddress(address: string): string {
  return address.trim().toLowerCase();
}

function normalizeAndDedupe(emails: string[]): string[] {
  return [...new Set(emails.map(normalizeEmailAddress))];
}

// Execution Environment as defined in the wranger.toml file
// See cloudflare docs for information on how to define this
interface Environment {}

async function forwardAll(
  message: ForwardableEmailMessage,
  recipients: string[]
) {
  const deduped = normalizeAndDedupe(recipients);

  try {
    await Promise.all(deduped.map((r) => message.forward(r)));
  } catch (e) {
    console.error(`Failed to forward email: ${e}`);
  }
}

function blackholeMessage(message: ForwardableEmailMessage) {
  const msg = createMimeMessage();
  msg.setHeader('In-Reply-To', message.headers.get('Message-ID')!);
  msg.setHeader('Auto-Submitted', 'auto-replied');
  msg.setHeader('Precedence', 'bulk');
  msg.setSender({ name: 'No Reply', addr: message.to });
  msg.setRecipient(message.from);
  msg.setSubject('Unmonitored Email Address');
  msg.addMessage({
    contentType: 'text/plain',
    data: `This email address is not monitored. Please direct inquiries to the appropriate contact found at ieeetamu.org.`,
  });

  const reply = new EmailMessage(message.to, message.from, msg.asRaw());
  return reply;
}

async function discardAndNotify(message: ForwardableEmailMessage) {
  try {
    const reply = blackholeMessage(message);
    await message.reply(reply);
  } catch (e) {
    console.error(`Failed to blackhole email: ${e}`);
  }
}

export default {
  async email(
    message: ForwardableEmailMessage,
    _env: Environment,
    _ctx: ExecutionContext
  ) {
    // Validate domain to prevent forwarding abuse
    if (!message.to.endsWith('@ieeetamu.org')) {
      console.warn('Rejected message for foreign domain:', message.to);
      return;
    }

    const normalizedTo = normalizeEmailAddress(message.to);
    const route = Routes.find(
      ({ destination }) => normalizeEmailAddress(destination) === normalizedTo
    );

    // Always forward to audit recipient first (except for blackholed emails)

    if (!route) {
      console.log(`No route found for email to ${message.to}`);

      const recipients = normalizeAndDedupe([DefaultRecipient, AuditRecipient]);

      await forwardAll(message, recipients);
    } else if (route.recipients.includes(BlackholeRecipient)) {
      console.log(`Blackholing email to ${message.to}`);
      await discardAndNotify(message);
    } else {
      console.log(
        `Forwarding email to ${message.to} to ${route.recipients.join(', ')}`
      );

      const recipients = normalizeAndDedupe([
        ...route.recipients,
        AuditRecipient,
      ]);

      await forwardAll(message, recipients);
    }
  },
};
