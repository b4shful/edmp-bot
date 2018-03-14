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

		message.channel.send(`\`giveFeedback\` only works in ${feedbackChannel}.`);
		return;
	};

	message.channel.send('**TODO:** Parse for length');

	const point = FeedbackPoint.create(message.author.id);
	client.feedbackPoints.set(point.id, point); // TODO: Use timestamp as id, don't need a special key.

	message.channel.send('You\'ve been rewarded a point for giving feedback!');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'User'
};

exports.help = {
	name: 'giveFeedback',
	category: 'Feedback',
	description: '',
	usage: 'giveFeedback'
};
