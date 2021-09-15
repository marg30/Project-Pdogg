const ytdl = require("ytdl-core");
const fs = require('fs');
const path = require('path');
const songController = require('../common/songController')

module.exports = {
  name: "play",
  description: "Play a song in your channel!",
  async execute(message) {
    try {
      const args = message.content.split(" ");
      if (args.length < 2){
        return message.reply("Not enough arguments!")
      }
      args.shift()
      const songName = args.join(" ");
      const controller = new songController();
      const songFullName = controller.findSong(songName, message); 
      console.log(songFullName);

    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  }
};
