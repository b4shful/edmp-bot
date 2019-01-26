/**
 * If it sounds good...
 *
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (_client, message) => message.channel.send("If it sounds good, it sounds good.");

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["soundsgoodbro"],
	permLevel: "User"
};

exports.help = {
	name: "soundsgood",
	category: "Miscellaneous",
	description: "If it sounds good...",
	usage: "soundsgood"
};
