import Discord from "discord.js";
import path from "path";
import FS from "fs";
import { prefix, token } from "../config.json";
import { USERS, BASE_DIR } from "../constants";
const client = new Discord.Client();
const commands: Array<string> = [];
import dotenv from "dotenv";
dotenv.config();

(() => {
  const dir = path.join(BASE_DIR, "src", "commands");
  FS.readdir(dir, (err, files) => {
    if (!err) {
      files.forEach((file) => commands.push(file.replace(".ts", "")));
    }
  });
})();

client.once("ready", () => {
  console.log("bobot running, DO NOT CLOSE!");
});

client.on("message", (msg) => {
  if (msg.content.startsWith(prefix)) {
    let args = msg.content.split(" ");
    const cmd = args[0].substring(1, args[0].length);

    if (commands.includes(cmd)) {
      args.splice(0, 1);
      const useCommand = require(path.join(
        BASE_DIR,
        "src",
        "commands",
        `${cmd}.ts`
      ));

      useCommand(msg, args);
    }
  }

  if (!msg.author.bot) {
    const content = msg.content.toUpperCase();
    if (content.includes("GEGE")) {
      if (msg.author.id == USERS.ME) return;
      msg.reply("gegegegegegegegegegegegegegegege pre");
      return;
    }
    if (content.includes("APEX")) {
      if (msg.author.id == USERS.ME) return;
      msg.reply("yuck apex");
      return;
    }
    if (content.includes("VALO")) {
      if (msg.author.id == USERS.ME) return;
      msg.reply("wew di nagaaya");
      return;
    }
  }
});

client.login(token);
