const fs = require('fs');
const path = require('path');

module.exports = class songController {
    async findSong(songName, message){
        const song = this.getSong(songName, message);
        if (!song.length){
          return;
        }
  
        if (song.length == 1 ){
            var fullSongName = song[0];
            const songFullPath = `C:/Users/maria/Documents/ba-server/discord-bot/music/${fullSongName}`;
            this.startQueue(message, songFullPath, fullSongName);

        } else {
          this.pickOneFromOptions(song, message)
        }
    }
    async startQueue(message, songFullPath, songName){
        const queue = message.client.queue;
        const serverQueue = message.client.queue.get(message.guild.id);
  
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
          return message.channel.send(
            "You need to be in a voice channel to play music!"
          );
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
          return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
          );
        }
  
        if (!serverQueue) {
          const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
          };
  
          queue.set(message.guild.id, queueContruct);
  
          queueContruct.songs.push(songFullPath);
  
          try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            this.play(message, queueContruct.songs[0], songName);
          } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
          }
        } else {
          serverQueue.songs.push(songFullPath);
          return message.channel.send(
            `${songName} has been added to the queue!`
          );
        }
    }
    getSong(songName, message) {
        //console.log(path.join("music"));
        const songs = fs.readdirSync(path.join("music"))
        var possibleSongs = []
        for (var i = 0; i < songs.length; i++){
            if(this.testinput(songName,songs[i])){
                possibleSongs.push(songs[i]);
            }
        }
        console.log(possibleSongs);
        if (possibleSongs){
            return possibleSongs;
        }
        message.channel.send("song not founded")
        return false;
    }
    play(message, song, songName) {
        const queue = message.client.queue;
        const guild = message.guild;
        const serverQueue = queue.get(message.guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection
        .play(song)
        .on("finish", () => {
            serverQueue.songs.shift();
            console.log("cjeeeklalsk");
            console.log(serverQueue.songs[0].split("/"));
            this.play(message, serverQueue.songs[0], serverQueue.songs[0].split("/").at(-1));
        })
        .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Start playing: **${songName}**`);
    }
    testinput(re, str) {
        if (str.toLowerCase().search(re.toLowerCase()) != -1) {
        return true;     
        }
        return false;
    }
    async pickOneFromOptions(songs, message){
        var text = "Pick one of the options.\n"
        for (var i = 0; i < songs.length; i++){
        text += `${i + 1}. ${songs[i]}\n`
        }
        var songsDict = {}
        var emojis = {
            "1": '1️⃣',
            "2": '2️⃣',
            "3": '3️⃣',
            "4": '4️⃣',
            "5": '5️⃣',
            "6": '6️⃣', 
            "7": '7️⃣',
            "8": '8️⃣',
            "9": '9️⃣',
            "10": '🔟',
        }
        message.channel.send(text).then(reactionMessage => {
        for (var i = 0; i < songs.length; i++){
            var emoji = emojis[i + 1];
            reactionMessage.react(emoji);
            songsDict[emoji] = songs[i];
        }
        const reactionFilter = (reaction, user) => {
            if (!reaction.me && reaction.emoji.name in songsDict) { 
                if (user.id === message.author.id) {
                    return true;
                }
            }
            return false;
        }; 
        this.collector = reactionMessage.createReactionCollector(reactionFilter, { time: 10000 });
        this.collector.on('collect', (reaction, user) => {
            const songFullPath = `${__dirname} /../music/${songsDict[reaction._emoji.name]}`;
            this.startQueue(message, songFullPath, songsDict[reaction._emoji.name]);
        })
        });
    }

    getEmoji(number) {
        switch (number) {
        case '1':
        return '1️⃣'
        case '2':
        return '2️⃣'
        case '3':
        return '3️⃣'
        case '4':
        return '4️⃣'
        case '5':
        return '5️⃣'
        case '6':
        return '6️⃣'
        case '7':
        return '7️⃣'
        case '8':
        return '8️⃣'
        case '9':
        return '9️⃣'
        case '10':
        return '🔟'
        default:
        return null;
        }      
    }

}