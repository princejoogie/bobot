import Discord from "discord.js";
import path from "path";
import say from "say";
import FS from "fs";
import { BASE_DIR } from "../../constants";

function tts(voiceChannel: Discord.VoiceChannel, text: string) {
  if (!FS.existsSync(path.join(BASE_DIR, "temp"))) {
    FS.mkdirSync(path.join(BASE_DIR, "temp"));
  }

  const timestamp = new Date().getTime();
  const soundPath = path.join(BASE_DIR, "temp", `${timestamp}.wav`);

  say.export(text, "Microsoft Zira Desktop", 1, soundPath, (err) => {
    if (err) {
      console.error(err);
      return;
    } else {
      voiceChannel
        .join()
        .then((connection) => {
          connection.play(soundPath).on("finish", () => {
            FS.unlinkSync(soundPath);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}

module.exports = (msg: Discord.Message, args: Array<string>) => {
  let arg = args.join(" ");

  const { voice } = msg.member!;

  if (!voice.channelID) {
    msg.reply("Sali ka muna voice channel nangyan.");
    return;
  } else {
    tts(voice.channel!, arg);
  }
};
