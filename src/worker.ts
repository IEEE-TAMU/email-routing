import { Routes, DefaultRecipient } from "./routes";

async function forwardToSingleRecipient(message: ForwardableEmailMessage, recipient: string) {
  await message.forward(recipient);
}

async function forwardToMultipleRecipients(message: ForwardableEmailMessage, recipients: string[]) {
  const body = message.raw;
  console.log(body);
  for (const recipient of recipients) {
    await message.forward(recipient);
  }
}

export default {
  async email(message: ForwardableEmailMessage, env: unknown, ctx: ExecutionContext) {
    const route = Routes.find(({ destination }) => destination === message.to)
    if (!route) {
      console.log(`No route found for email to ${message.to}`);
      forwardToSingleRecipient(message, DefaultRecipient);
    }
    else if (route.recipients.length === 1) {
      console.log(`Forwarding email to ${message.to} to ${route.recipients[0]}`);
      await forwardToSingleRecipient(message, route.recipients[0]);
    } else {
      console.log(`Forwarding email to ${message.to} to ${route.recipients.join(", ")}`);
      await forwardToMultipleRecipients(message, route.recipients);
    }
  }
}