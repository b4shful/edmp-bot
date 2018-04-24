const Logger = require('../util/Logger');
const FeedbackComment = require('../modules/feedback/FeedbackComment');
const postUsage = require('./post').help.usage;

// Duplicate from post.js
// TODO: Move regex into utiliy file as part of feedback module (FeedbackLink.js?)
const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm;

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

	const url = args[0];

	if (!url.match(regex)) {
		await message.delete();
		message.member.send(`${message.member} Please provide a valid URL for the track you submitted. Usage \`${help.usage}\``);
		return;
	}

	const comments = FeedbackComment.searchByUrl(client.database, url);

	if (comments.length === 0) {
		await message.delete();
		message.member.send(`${message.member} No feedback was found for that track. Post your track using \`${postUsage}\``);
		return;
	}

	const response = comments.reduce((response, { userId, timestamp, message }) => {
		const readableTimestamp = new Date(timestamp);
		const member = guild.members.get(userId);
		return `${response}\n\`<${readableTimestamp}>\` From ${member}:\n\n${message}\n`;
	}, `Feedback you've received for ${url}:\n`);

	await message.delete();
	message.member.send(response);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'User'
};

const help = {
	name: 'getFeedback',
	category: 'Feedback',
	description: 'DMs all the feedback given for requests containing the given link.',
	usage: ':edmp: getFeedback <link>'
};

exports.help = help;
