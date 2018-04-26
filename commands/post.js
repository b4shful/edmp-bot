const Logger = require('../util/Logger');
const FeedbackPoint = require('../modules/feedback/FeedbackPoint');
const FeedbackRequest = require('../modules/feedback/FeedbackRequest');
const feedbackUsage = require('./feedback').help.usage;

const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm;

// Necessary bullshit to handle using the primary prefix for the help command
let prefix = "uninitialized";
let help = {};

exports.init = (client) => {
    prefix = client.config.defaultSettings.prefix[0];

    help = {
	name: 'post',
	category: 'Feedback',
	description: 'Posts a feedback request people can comment on. You must have at least one point to post a track for feedback.',
	usage: `${prefix} post <link to your track> <any comments...>`
    };

    exports.help = help;
}

/**
 * Removes the command and arguments from the message content.
 */
const stripCommandFromMessage = messageContent => {
	const index = messageContent.indexOf(help.name) + help.name.length + 1;
	return messageContent.substr(index);
};

/**
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = async (client, message) => {
	if (message.author.bot || !message.member) {
		return;
	}

	if (message.channel.name !== 'feedback-trade') {
		const feedbackChannel =
			message.guild.channels.find('name', 'feedback-trade') || '#feedback-trade';

		message.channel.send(`\`${help.name}\` only works in ${feedbackChannel}.`);
		return;
	};

	const matches = message.content.match(regex);

	if (!matches || matches.length === 0) {
		message.channel.send(`${message.member} You need to provide a link to your track. Usage: \`${help.usage}\``);
		return;
	}

	if (matches.length > 1) {
		message.channel.send(`${message.member} You can only ask for feedback on one track per point. Usage: \`${help.usage}\``);
		return;
	}

	// TODO: Parse link if it's permitted (audio host whitelist).
	// NOTE: For some services, check if the link is a playlist/set
	// and respond with a "you can only request feedback for one track".

	const database = client.database;
	const userId = message.member.id;

	let redeemed;
	let response;

	try {
		redeemed = FeedbackPoint.redeem(database, userId);
	}
	catch (error) {
		Logger.error(error);
		response = 'Something went wrong, please notify `@Staff`.';
	}

	if (!response && !redeemed) {
		await message.delete();
		response = `${message.member} You do not have any points available. Give someone else some feedback to earn a point to redeem using \`${feedbackUsage}\``;
	}
	
	if (!response && redeemed) {
		Logger.log(`${message.member.displayName} (${message.author.username}#${message.author.discriminator}) redeemed a FeedbackPoint`);

		try {
			const id = FeedbackRequest.create(database, userId, stripCommandFromMessage(message.content));
			response = `${message.member} submitted a track for feedback! Give them feedback using \`${prefix} feedback ${id} <feedback...>\``;
		}
		catch (error) {
			Logger.error(error);
			response = 'Something went wrong, please notify `@Staff`.';
		}
	}

	message.channel.send(response);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'User'
};



