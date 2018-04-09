const Logger = require('../util/Logger');
const FeedbackPoint = require('../modules/feedback/FeedbackPoint');
const FeedbackRequest = require('../modules/feedback/FeedbackRequest');

const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm;

/**
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = async (client, message) => {
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

	let response;
	try {
		const database = client.database;
		const userId = message.member.id;

		FeedbackPoint.redeem(database, userId);
		Logger.log(`${message.member.displayName} (${message.author.username}#${message.author.discriminator}) redeemed a FeedbackPoint`);

		const id = FeedbackRequest.create(database, userId, message.content);

		response = `You submitted a track for feedback! People can give you feedback using \`giveFeedback ${id}\`.`;
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

exports.help = {
	name: 'getFeedback',
	category: 'Feedback',
	description: '',
	usage: 'getFeedback'
};
