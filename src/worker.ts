import { Mappings, DefaultRecipient } from "./users";



export default {
  async email(message: ForwardableEmailMessage, env: unknown, ctx: ExecutionContext) {
    const recipient = Mappings.find(({ email }) => email === message.to)?.recipient ?? DefaultRecipient;
    console.log(`Forwarding email from ${message.from} to ${recipient}`);
    await message.forward(recipient);
  }
}