import { EmailMessage } from "cloudflare:email";
import { Routes, DefaultRecipient } from "./routes";

// Execution Environment as defined in the wranger.toml file
// See cloudflare docs for information on how to define this
interface Environment {
  MAIL: {
    send(message: EmailMessage): Promise<void>
  }
}

// format a banner to remind users to CC other officers that are on the route
function makeBanner(otherRecipients: string[]) {
  // TODO: make banner better
  return "This email was sent to multiple officers. Please remember to CC all officers who got this message. \n\n" + otherRecipients.join(", ");
}

function messageWithBanner(message: ForwardableEmailMessage, recipient: string, otherRecipients: string[]) {
  const banner = new TextEncoder().encode(makeBanner(otherRecipients));
  const reader = message.raw.getReader();

  // Create a new ReadableStream with the prepended banner
  const newBody = new ReadableStream({
    start(controller) {
      controller.enqueue(banner);

      function pump() {
        reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          pump();
        }).catch(error => controller.error(error));
      }

      pump();
    }
  });

  return new EmailMessage(message.from, recipient, newBody);
}


async function forwardToSingleRecipient(message: ForwardableEmailMessage, recipient: string) {
  try {
    await message.forward(recipient);
  } catch (e) {
    console.error(`Failed to forward email to ${recipient}: ${e}`);
  }
}

async function forwardToMultipleRecipients(message: ForwardableEmailMessage, recipients: string[], env: Environment) {
  for (const recipient of recipients) {
    try {
      await env.MAIL.send(messageWithBanner(message, recipient, recipients.filter(r => r !== recipient)));
    } catch (e) {
      console.error(`Failed to forward email to ${recipient}: ${e}`);
    }
  }
}

export default {
  async email(message: ForwardableEmailMessage, env: Environment, ctx: ExecutionContext) {
    const route = Routes.find(({ destination }) => destination === message.to)
    if (!route) {
      console.log(`No route found for email to ${message.to}`);
      await forwardToSingleRecipient(message, DefaultRecipient);
    }
    else if (route.recipients.length === 1) {
      console.log(`Forwarding email to ${message.to} to ${route.recipients[0]}`);
      await forwardToSingleRecipient(message, route.recipients[0]);
    } else {
      console.log(`Forwarding email to ${message.to} to ${route.recipients.join(", ")}`);
      await forwardToMultipleRecipients(message, route.recipients, env);
    }
  }
}