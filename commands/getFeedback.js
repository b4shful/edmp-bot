const Logger = require('../util/Logger');
const FeedbackComment = require('../modules/feedback/FeedbackComment');

/**
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = async (client, message, args) => {
	if (message.author.bot || !message.member) {
		return;
	}

	let response;

	const url = args[0];
	const comments = FeedbackComment.searchByUrl(client.database, url);

	if (comments.length === 0) {
		response = `You have not received any feedback for ${url}`;
	}

	if (!response) {
		response = comments.reduce((response, { timestamp, message }) =>
			`${response}\n\`<${timestamp}>\` ${message}`, `Feedback you've received for ${url}:`);
	}

	message.member.send(response);
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
	usage: ''
};
