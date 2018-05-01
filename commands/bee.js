/**
 * Responds with a link to AdmiralBumbleBee's blog.
 *
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
	message.channel.send("AdmiralBumbleBee Blog: http://admiralbumblebee.com/edmp");
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["dad"],
	permLevel: "User"
};

exports.help = {
	name: "bee",
	category: "Links",
	description: "Responds with a link to AdmiralBumbleBee's blog.",
	usage: "bee"
};
