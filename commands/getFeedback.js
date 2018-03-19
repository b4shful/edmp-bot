const Logger = require('../util/Logger');
const FeedbackPoint = require('../util/FeedbackPoint');

const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm;

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

	const matches = message.content.match(regex);

	if (!matches || matches.length === 0) {
		message.channel.send('You need to provide a link to your track.');
		return;
	}

	if (matches.length > 1) {
		message.channel.send('You can only ask for feedback on one track per point.');
		return;
	}

	// TODO: Parse link if it's permitted (audio host whitelist).
	// NOTE: For some services, check if the link is a playlist/set
	// and respond with a "you can only request feedback for one track".

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
