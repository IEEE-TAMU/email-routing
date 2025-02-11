import { Routes, DefaultRecipient } from "./routes";

export default {
  async email(message: ForwardableEmailMessage, env: unknown, ctx: ExecutionContext) {
    let recipient = Routes.find(({ destination }) => destination === message.to)?.recipient
    if (!recipient) {
      console.log(`No route found for email to ${message.to}, forwarding to default recipient: ${DefaultRecipient}`);
      recipient = DefaultRecipient;
    }
    console.log(`Forwarding email from ${message.from} to ${recipient}`);
    try {
      await message.forward(recipient);
    } catch (error) {
      console.error('Error forwarding email:', error);
    }
  }
}