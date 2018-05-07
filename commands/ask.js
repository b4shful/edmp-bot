/**
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => message.channel.send(`Don't ask to ask a question, ***ask*** the question!`);

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "ask",
	category: "Miscellaneous",
	description: "What to do when you have a question on the internet.",
	usage: "ask"
};
