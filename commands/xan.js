/**
 * Responds with a link to Xan's SoundCloud.
 *
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
	message.channel.send("Xan: https://soundcloud.com/therealxan");
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "xan",
	category: "Links",
	description: "Responds with a link to Xan's SoundCloud.",
	usage: "xan"
};
