const FeedbackPoint = require('../modules/feedback/FeedbackPoint');

/**
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = async (client, message) => {
	if (message.author.bot) return;

	if (!message.member) return; // Must be a server member.

	let response;
	try {
		const numPoints = await FeedbackPoint.count(client.database, message.member.id);
		response = numPoints > 0 ?
			`You have ${numPoints} points.` :
			'You have no usable points, try giving some feedback.';
	}
	catch (error) {
		response = 'Something went wrong.';
	}

	message.channel.send(response);
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'User'
};

exports.help = {
	name: 'points',
	category: 'Feedback',
	description: '',
	usage: 'points'
};
