import Discord from "discord.js";

module.exports = (msg: Discord.Message) => {
  let reply = "```\n";
  reply += "Commands\n\n";
  reply += "?s <phrase> - says phrase in a voice channel\n";
  reply += "?a <audio> - plays an mp3 file in the server\n";
  reply += "?a list - lists all playable files\n";
  reply += "```";
  msg.channel.send(reply);
};
