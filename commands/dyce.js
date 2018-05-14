/**
 * Responds with a link to dyce.'s SoundCloud.
 *
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
	message.channel.send("dyce. - https://soundcloud.com/dyce-dot");
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["dyce."],
	permLevel: "User"
};

exports.help = {
	name: "dyce",
	category: "Links",
	description: "Responds with a link to dyce.'s SoundCloud.",
	usage: "dyce"
};
