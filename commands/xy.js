/**
 * A friendly reminder to read your software manual.
 *
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) =>
	message.channel.send(
		"It seems like you are asking about a solution, not about your problem. Read this page and learn how to learn better: http://xyproblem.info"
	);

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "xy",
	category: "Miscellaneous",
	description: "XY question",
	usage: "xy"
};
