import { Routes, DefaultRecipient } from "./routes";

export default {
  async email(message: ForwardableEmailMessage, env: unknown, ctx: ExecutionContext) {
    const recipient = Routes.find(({ destination }) => destination === message.to)?.recipient ?? DefaultRecipient;
    console.log(`Forwarding email from ${message.from} to ${recipient}`);
    try {
      await message.forward(recipient);
    } catch (error) {
      console.error('Error forwarding email:', error);
    }
  }
}