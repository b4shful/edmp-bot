const Logger = require('../util/Logger');
const FeedbackRequest = require('../modules/feedback/FeedbackRequest');

const formatRequestList = (members, requests) => {
	const list = requests.map(request => {
		try {
			const link = FeedbackRequest.getLink(request);
			const displayName = members.get(request.userId).displayName;
			return `- \`${request.id}\` ${displayName} - <${link}>`;
		}
		catch (error) {
			Logger.error(error);
			return '';
		}
	}).filter(item => item.length !== 0);

	if (!(list.length > 0)) {
		return 'No one has requested feedback yet!';
	}

	return [
		'Requests that haven\'t received any feedback:',
		...list
	].join('\n');
};

/**
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
	const { author, member } = message;

	if (author.bot || !member) {
		return;
	}

	if (message.channel.name !== 'feedback-trade') {
		const feedbackChannel =
			message.guild.channels.find('name', 'feedback-trade') || '#feedback-trade';

		message.channel.send(`\`need\` only works in ${feedbackChannel}.`);
		return;
	}

	const members = message.guild.members;
	const requests = FeedbackRequest.need(client.database, 6);
	message.channel.send(formatRequestList(members, requests));
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'User'
};

exports.help = {
	name: 'need',
	category: 'Feedback',
	description: '',
	usage: 'need'
};
