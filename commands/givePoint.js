const Logger = require('../util/Logger');
const FeedbackPoint = require('../modules/feedback/FeedbackPoint');

const mentionsMember = message => {
	const { author, mentions } = message;
	const { everyone, roles, members } = mentions;

	if (everyone) {
		throw new TypeError('You can\'t give a point to everyone...');
	}

	if (roles.size > 0) {
		throw new TypeError('Mention who you want to give a point to, not their role(s).');
	}

	if (!members || members.size <= 0) {
		throw new TypeError('Mention who is going to receive a point.');
	}

	if (members.size > 1) {
		throw new TypeError('Only one person may receive a point.');
	}

	const mentionedMember = members.first();

	if (author.id === mentionedMember.id) {
		throw new TypeError('**SHAME!** Do not give points to yourself!');
	}

	return mentionedMember;
};

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

	let mentionedMember;
	let response;

	try {
		mentionedMember = mentionsMember(message);
	}
	catch (error) {
		response = error.message;
	}

	if (!response) {
		try {
			FeedbackPoint.create(client.database, mentionedMember.id, message.content);

			const { member } = message;
			Logger.log(`${member.displayName} (${member.username}#${member.discriminator}) gave a FeedbackPoint to ${mentionedMember.displayName} (${mentionedMember.username}#${mentionedMember.discriminator})`);

			response = `${mentionedMember} received a point for giving feedback!`;
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
	permLevel: 'Mentor'
};

const help = {
	name: 'givePoint',
	category: 'Feedback',
	description: 'Gives a user a feedback point. This is for moderation purposes and should not be used often.',
	usage: 'givePoint <member>'
};

exports.help = help;
