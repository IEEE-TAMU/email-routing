import mappings from "./users";

const default_email = "chnorton@tamu.edu";

export default {
  async email(message, env, ctx) {
    const recipient = mappings.find(({ email }) => email === message.to)?.recipient;
    if (recipient) {
      await message.forward(recipient);
    } else {
      await message.forward(default_email);
    }
  }
}