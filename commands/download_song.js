const ytdl = require("ytdl-core");
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "download",
  description: "Dowload a song",
  async execute(message) {
    try {
      const args = message.content.split(" ");
      const videoUrl = args[1];

      if(!ytdl.validateURL(videoUrl)){
        return message.reply("Invalid URL!")
      }
      const songInfo = await ytdl.getInfo(args[1]);
      var songTitle = songInfo.videoDetails.title.replace(/[/\\?%*:|"<>]/g, '-');
      ytdl(videoUrl).pipe(fs.createWriteStream(`${__dirname} /../music/${songTitle}.mp3`));
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  }
};
