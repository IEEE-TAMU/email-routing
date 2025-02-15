import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";
import { Routes, DefaultRecipient, BlackholeRecipient } from "./routes";

// Execution Environment as defined in the wranger.toml file
// See cloudflare docs for information on how to define this
interface Environment { }


async function forwardToSingleRecipient(message: ForwardableEmailMessage, recipient: string) {
  try {
    await message.forward(recipient);
  } catch (e) {
    console.error(`Failed to forward email to ${recipient}: ${e}`);
  }
}

async function forwardToMultipleRecipients(message: ForwardableEmailMessage, recipients: string[], env: Environment) {
  for (const recipient of recipients) {
    forwardToSingleRecipient(message, recipient);
  }
}

function blackholeMessage(message: ForwardableEmailMessage) {
  const msg = createMimeMessage();
  msg.setHeader("In-Reply-To", message.headers.get("Message-ID")!);
  msg.setSender({ name: "No Reply", addr: message.to });
  msg.setRecipient(message.from);
  msg.setSubject("Unmonitored Email Address");
  msg.addMessage({
    contentType: 'text/plain',
    data: `This email address is not monitored. Please direct inquiries to the appropriate contact found at ieeetamu.org.`
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
  async email(message: ForwardableEmailMessage, env: Environment, ctx: ExecutionContext) {
    const route = Routes.find(({ destination }) => destination === message.to)
    if (!route) {
      console.log(`No route found for email to ${message.to}`);
      await forwardToSingleRecipient(message, DefaultRecipient);
    }
    else if (route.recipients.includes(BlackholeRecipient)) {
      console.log(`Blackholing email to ${message.to}`);
      await discardAndNotify(message);
    } else if (route.recipients.length === 1) {
      console.log(`Forwarding email to ${message.to} to ${route.recipients[0]}`);
      await forwardToSingleRecipient(message, route.recipients[0]);
    } else {
      console.log(`Forwarding email to ${message.to} to ${route.recipients.join(", ")}`);
      await forwardToMultipleRecipients(message, route.recipients, env);
    }
  }
}