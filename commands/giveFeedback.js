const Logger = require('../util/Logger');
const FeedbackPoint = require('../util/FeedbackPoint');

const mentionsMember = message => {
	const { mentions } = message;
	const { everyone, roles, members } = mentions;

	if (everyone) {
		throw new TypeError('You can\'t give feedback to everyone... or at least not at once.');
	}

	if (roles.size > 0) {
		throw new TypeError('Mention who you want to give feedback to, not their role(s).');
	}

	if (!members || members.size <= 0) {
		throw new TypeError('Mention who you are giving feedback to in order to receive a point.');
	}

	if (members.size > 1) {
		throw new TypeError('Give feedback to one person at a time.');
	}

	// TODO: Check if they're mentioning themself.
};

const isAcceptable = feedback => {
	// TODO: Determine a more sophisticated solution for determining what is
	// acceptable feedback.
	if (feedback.length < 200) return false;

	return true;
};

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

		message.channel.send(`\`giveFeedback\` only works in ${feedbackChannel}.`);
		return;
	}

	try {
		mentionsMember(message);
	}
	catch (error) {
		message.channel.send(error.message);
		return;
	}

	if (!isAcceptable(message.content)) {
		message.channel.send('The feedback you gave is really short, please be more constructive.');
		return;
	}

	const point = FeedbackPoint.create(message.member.id, message.content);
	client.feedbackPoints.set(point.id, point); // TODO: Use timestamp as id, don't need a special key.
	Logger.log(`${message.member.displayName} (${message.author.username}#${message.author.discriminator}) received a FeedbackPoint: ${JSON.stringify(point)}...`);

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
