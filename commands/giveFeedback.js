const Logger = require('../util/Logger');
const FeedbackPoint = require('../modules/feedback/FeedbackPoint');
const FeedbackComment = require('../modules/feedback/FeedbackComment');

/**
 * NOTE: Unused for the time being.
 */
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
	if (feedback.length < 140) return false;

	return true;
};

/**
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = async (client, message, args) => {
	if (message.author.bot) return;

	if (!message.member) return; // Must be a server member.

	if (message.channel.name !== 'feedback-trade') {
		const feedbackChannel =
			message.guild.channels.find('name', 'feedback-trade') || '#feedback-trade';

		message.channel.send(`\`giveFeedback\` only works in ${feedbackChannel}.`);
		return;
	}

	let requestId;
	try {
		requestId = parseInt(args[0]);

		if (!requestId) {
			throw new TypeError(`${message.member} You must provide a valid request id to submit your feedback.\nUsage: \`${help.usage}\``);
		}
	}
	catch (error) {
		message.channel.send(error.message);
		return;
	}

	if (!isAcceptable(message.content)) {
		message.channel.send(`${message.member} The feedback you gave is really short, please be more constructive.`);
		return;
	}

	let response;
	try {
		const database = client.database;
		const userId = message.member.id;
		const messageContent = message.content;

		FeedbackComment.create(database, requestId, userId, messageContent);
		FeedbackPoint.create(database, userId, messageContent);

		Logger.log(`${message.member.displayName} (${message.author.username}#${message.author.discriminator}) received a FeedbackPoint`);

		response = `${message.member} has been rewarded a point for giving feedback!`;
	}
	catch (error) {
		response = error.message;
	}

	message.channel.send(response);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'User'
};

const help = {
	name: 'giveFeedback',
	category: 'Feedback',
	description: '',
	usage: 'giveFeedback <requestId> <your feedback...>'
};

exports.help = help;
