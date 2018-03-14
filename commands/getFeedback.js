const FeedbackPoint = require('../util/FeedbackPoint');

/**
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
	if (message.author.bot) return;

	if (message.channel.name !== 'feedback-trade') {
		const feedbackChannel =
			message.guild.channels.find('name', 'feedback-trade') || '#feedback-trade';

		message.channel.send(`\`getFeedback\` only works in ${feedbackChannel}.`);
		return;
	};

	message.channel.send('**TODO:** Parse link');

	const userPoints = client.feedbackPoints
		.filterArray(point => point.userId === message.author.id);

	let usedPoint = false;
	console.log(userPoints);
	for (let i = 0; i < userPoints.length; i++) {
		const point = userPoints[i];
		console.log(point);

		if (FeedbackPoint.isExpired(point)) continue;

		const isFresh = (Date.now() - point.timestamp) < FeedbackPoint.timeToLive;
		if (isFresh) {
			console.log('fresh');
			client.feedbackPoints.set(point.id, FeedbackPoint.expire(point));
			usedPoint = true;
			break;
		}

		// If the point is expired but is not set to used, do so to
		// speed up check for next time.
		if (!point.used) {
			client.feedbackPoints.set(point.id, FeedbackPoint.expire(point));
		}
	}

	if (usedPoint) {
		message.channel.send('You submitted a track for feedback!');
	}
	else {
		// No points are fresh, they cannot request feedback...
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
