/**
 * A friendly reminder to read your software manual.
 *
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => message.channel.send("*Read the fuckin' manual*");

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Mentor"
};

exports.help = {
	name: "rtfm",
	category: "Miscellaneous",
	description: "Read the fuckin' manual.",
	usage: "rtfm"
};
