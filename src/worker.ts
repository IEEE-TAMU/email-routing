import mappings from "./users";

export default {
  async email(message, env, ctx) {
    const recipient = mappings.find(({ email }) => email === message.to)?.recipient;
    if (recipient) {
      await message.forward(recipient);
    } else {
      message.setReject("Unknown address");
    }
  }
}