const FeedbackPoint = require('../modules/feedback/FeedbackPoint');
const feedbackUsage = require('./feedback').help.usage;

/**
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = async (client, message) => {
	const { author, member } = message;

	if (author.bot || !member) {
		return;
	}

	let response;
	try {
		const numPoints = await FeedbackPoint.count(client.database, member.id);
		response = numPoints > 0 ?
			`${member} has ${numPoints} ${numPoints > 1 ? 'points.' : 'point.'}` :
			`${member} has no usable points, try giving some feedback by using \`${feedbackUsage}\``;
	}
	catch (error) {
		response = 'Something went wrong, please notify `@Staff`.';
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
