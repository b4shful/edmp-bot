const Logger = require('../util/Logger');
const FeedbackPoint = require('../util/FeedbackPoint');

/**
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
	if (message.author.bot) return;

	if (!message.member) return; // Must be a server member.

	if (message.channel.name !== 'feedback-trade') {
		const feedbackChannel =
			message.guild.channels.find('name', 'feedback-trade') || '#feedback-trade';

		message.channel.send(`\`getFeedback\` only works in ${feedbackChannel}.`);
		return;
	};

	// TODO: Parse feedback request to see if the link is allowed.
	// NOTE: For some services, check if the link is a playlist/set
	// and respond with a "you can only request feedback for one track".
	message.channel.send('**TODO:** Parse link');

	const userPoints = client.feedbackPoints
		.filterArray(point => point.userId === message.author.id);

	let usedPoint = false;
	for (let point of userPoints) {
		client.feedbackPoints.delete(point.id);

		if (!FeedbackPoint.isExpired(point) && !point.used) {
			Logger.log(`${message.member.displayName} (${message.author.username}#${message.author.discriminator}) used a FeedbackPoint: ${JSON.stringify(point)}...`);
			usedPoint = true;
			break;
		}

		Logger.log(`Deleted an old FeedbackPoint for ${message.member.displayName} (${message.author.username}#${message.author.discriminator}): ${JSON.stringify(point)}...`);
	}

	if (usedPoint) {
		message.channel.send('You submitted a track for feedback!');
	}
	else {
		message.channel.send('You need to give feedback first.');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'User'
};

exports.help = {
	name: 'getFeedback',
	category: 'Feedback',
	description: '',
	usage: 'getFeedback'
};
