import Discord from "discord.js";

module.exports = (msg: Discord.Message) => {
  try {
    const { voice } = msg.member!;
    voice.channel!.leave();
  } catch (err) {
    console.error(err);
  }
};
