const ytpl = require("ytpl");
const ytdl = require("ytdl-core");
const fs = require('fs');

module.exports = {
  name: "download_playlist",
  description: "Play a playlist in your channel!",
  async execute(message) {
    try {
        const args = message.content.split(" ");

        const playlistId = await ytpl.getPlaylistID(args[1]);
        console.log(playlistId);
        const playlist = await ytpl(playlistId);
        //console.log(playlist);

        const songs = await ytpl(playlistId, { pages: 5 });
        // You can now use the .items property of all result batches e.g.:
        for (var i = 0; i < songs.items.length; i++) {
            var song = songs.items[i]
            var songTitle = song.title.replace(/[/\\?%*:|"<>]/g, '-');
            ytdl(song.url).pipe(fs.createWriteStream(`${__dirname} /../songs/${songTitle}.mp3`));
        }
      
    } catch (error) {
        console.log(error);
        message.channel.send(error.message);
    }
  },
};