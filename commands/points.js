const FeedbackPoint = require('../util/FeedbackPoint');

/**
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
	if (message.author.bot) return;

	const userPoints = client.feedbackPoints
		.filterArray(point => {
			const belongsToUser = point.userId === message.author.id;
			const isFresh = (Date.now() - point.timestamp) < FeedbackPoint.timeToLive;
			const unused = point.used === false;
			return belongsToUser && isFresh && unused;
		});

	const numPoints = userPoints.length || 0;

	const response = !userPoints || numPoints <= 0 ?
		'You have no usable points, try giving some feedback.' :
		`You have ${numPoints} points.`;
	
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
