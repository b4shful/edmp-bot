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

	const guild = message.guild;

	try {
		if (!guild) {
			throw new TypeError('Must be a member of the server to use this command');
		}

		if (!guild.available) {
			throw new TypeError('Server is unavailable at the moment');
		}
	}
	catch (error) {
		message.member.send(error.message);
		return;
	}

	let response;
	const url = args[0];
	const comments = FeedbackComment.searchByUrl(client.database, url);

	if (comments.length === 0) {
		response = `You have not received any feedback for ${url}`;
	}

	if (!response) {
		response = comments.reduce((response, { userId, timestamp, message }) => {
			const readableTimestamp = new Date(timestamp);
			const member = guild.members.get(userId);
			return `${response}\n\`<${readableTimestamp}>\` From ${member}:\n${message}\n`;
		}, `Feedback you've received for ${url}:\n`);
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
	usage: ':edmp: getFeedback <link>'
};
