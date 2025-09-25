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

// Execution Environment as defined in the wranger.toml file
// See cloudflare docs for information on how to define this
interface Environment {}

async function forwardToSingleRecipient(
  message: ForwardableEmailMessage,
  recipient: string
) {
  try {
    await message.forward(recipient);
  } catch (e) {
    console.error(`Failed to forward email to ${recipient}: ${e}`);
  }
}

async function forwardToMultipleRecipients(
  message: ForwardableEmailMessage,
  recipients: string[]
) {
  try {
    await Promise.all(
      recipients.map((recipient) => message.forward(recipient))
    );
  } catch (e) {
    console.error(`Failed to forward email to multiple recipients: ${e}`);
  }
}

async function forwardToAudit(message: ForwardableEmailMessage) {
  try {
    await message.forward(AuditRecipient);
    console.log(`Forwarded email to audit recipient: ${AuditRecipient}`);
  } catch (e) {
    console.error(
      `Failed to forward email to audit recipient ${AuditRecipient}: ${e}`
    );
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
    let isBlackholed = false;

    if (!route) {
      console.log(`No route found for email to ${message.to}`);
      await Promise.all([
        forwardToSingleRecipient(message, DefaultRecipient),
        forwardToAudit(message),
      ]);
    } else if (route.recipients.includes(BlackholeRecipient)) {
      console.log(`Blackholing email to ${message.to}`);
      isBlackholed = true;
      await discardAndNotify(message);
      // Note: We don't forward blackholed emails to audit to avoid spam
    } else if (route.recipients.length === 1) {
      console.log(
        `Forwarding email to ${message.to} to ${route.recipients[0]}`
      );
      await Promise.all([
        forwardToSingleRecipient(message, route.recipients[0]),
        forwardToAudit(message),
      ]);
    } else {
      console.log(
        `Forwarding email to ${message.to} to ${route.recipients.join(', ')}`
      );
      await Promise.all([
        forwardToMultipleRecipients(message, route.recipients),
        forwardToAudit(message),
      ]);
    }
  },
};
