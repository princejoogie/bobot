import Discord from "discord.js";
import FS from "fs";
import path from "path";
import { BASE_DIR } from "../../constants";

const auth = ["452824776340406273", "241667451618590724"];

type AudioProp = {
  track: string;
  n: number;
  dir: string;
};

const playAudio = (
  msg: Discord.Message,
  voice: Discord.VoiceState,
  { track, n, dir }: AudioProp
) => {
  try {
    if (!voice.channelID) {
      msg.reply("Sali ka muna voice channel nangyan.");
      return;
    } else {
      voice
        .channel!.join()
        .then((connection) => {
          const play = () => {
            connection.play(path.join(dir, `${track}.mp3`)).on("finish", () => {
              if (n <= 1) return;
              n--;
              play();
            });
          };
          if (n) play();
          else connection.play(path.join(dir, `${track}.mp3`));
        })
        .catch((err) => {
          msg.reply("Gago wait may error.");
          console.error(err);
        });
    }
  } catch (err) {
    console.error(err);
    msg.reply("Gago wait may error. Try mo ko i-recon with `?dc`");
  }
};

const listDir = (msg: Discord.Message, dir: string) => {
  FS.readdir(dir, (err, files) => {
    if (err) {
      msg.channel.send("Unable to scan directory: " + err);
      return;
    } else {
      let reply = "```\n";
      reply += "AUDIO files:\n\n";
      files.forEach((file) => {
        reply += " > " + file.replace(".mp3", "") + "\n";
      });
      reply += "```";
      msg.channel.send(reply);
    }
  });
};

module.exports = (msg: Discord.Message, args: Array<string>) => {
  let track = args[0];
  let count = args[1];
  let n = parseInt(count);

  const { voice } = msg.member!;

  if (track == "-p") {
    if (auth.includes(msg.author.id)) {
      const newTrack = args[1];
      count = args[2];
      n = parseInt(count);

      if (newTrack.toUpperCase() === "LIST") {
        listDir(msg, path.join(BASE_DIR, "private_audio"));
        return;
      } else {
        playAudio(msg, voice, {
          track: newTrack,
          n,
          dir: path.join(BASE_DIR, "private_audio"),
        });
      }
    } else {
      msg.reply("Wala kang permission.");
    }

    return;
  }

  if (track.toUpperCase() === "LIST") {
    listDir(msg, path.join(BASE_DIR, "audio"));
    return;
  }

  if (!voice.channelID) {
    msg.reply("Sali ka muna voice channel nangyan.");
    return;
  } else {
    playAudio(msg, voice, { track, n, dir: path.join(BASE_DIR, "audio") });
    return;
  }
};
