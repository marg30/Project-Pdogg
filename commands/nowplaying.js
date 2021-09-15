module.exports = {
	name: 'nowplaying',
	description: 'Get the song that is playing.',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		console.log("server queue");
		const songName = serverQueue.songs[0].split("/").at(-1)
		return message.channel.send(`Now playing: ${songName}`);
	},
};