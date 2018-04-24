const FeedbackPoint = require('../modules/feedback/FeedbackPoint');
const feedbackUsage = require('./feedback').help.usage;

const getMentionedMember = message => {
	const { author, mentions } = message;
	const { everyone, roles, members } = mentions;

	if (everyone) {
		throw new TypeError('You can check only one person\'s points');
	}

	if (roles.size > 0) {
		throw new TypeError('Mention one person, not their role(s).');
	}

	if (!members) {
		return undefined;
	}

	if (members.size > 1) {
		throw new TypeError('Mention only one person to view how many points they have.');
	}

	return members.first();
};

/**
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = async (client, message) => {
	const { author, member } = message;

	if (author.bot || !member) {
		return;
	}

	let response;
	let mentionedMember;

	try {
		mentionedMember = getMentionedMember(message);
	} catch (error) {
		response = error.message;
	}

	if (!response) {
		const memberId = mentionedMember ? mentionedMember.id : member.id;
		const memberName = mentionedMember ? mentionedMember.displayName : member;
		try {
			const numPoints = await FeedbackPoint.count(client.database, memberId);
			response = numPoints > 0 ?
				`${memberName} has ${numPoints} ${numPoints > 1 ? 'points.' : 'point.'}` :
				`${memberName} has no usable points${!mentionedMember ? `, try giving some feedback by using \`${feedbackUsage}\`` : '.'}`;
		}
		catch (error) {
			response = 'Something went wrong, please notify `@Staff`.';
		}
	}

	message.channel.send(response);
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'User'
};

exports.help = {
	name: 'points',
	category: 'Feedback',
	description: '',
	usage: 'points'
};
