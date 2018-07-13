const Logger = require('../util/Logger');
const {
	getGuild,
	getMentionedMember,
	muteInServer,
	ignoreBots,
	respond
} = require('../modules/moderation/utils');

const Task = require('../modules/tasks/Task');

exports.run = (_client, message, args) =>
	ignoreBots(message, () =>
		respond(message, async () => {
			const guild = getGuild(message);
			const member = getMentionedMember(message);

			if (message.author.id === member.user.id) {
				throw new TypeError('Don\'t mute yourself');
			}

			if (message.mentions.members.length > 1) {
				throw new TypeError('Please mute one person at a time');
			}

			// Only one mentioned allowed, so following tokens are reason message.
			const reason = args.length > 1 ? `${args.slice(1).join(' ')}` : 'No reason';

			try {
				await muteInServer(guild, member, reason);
			}
			catch (error) {
				throw new TypeError(`Unable to mute user: ${error.message}`);
			}

			const response = `${member.displayName} (\`${member.user.username}#${member.user.discriminator}\`) was muted (\`${reason}\`)`;
			Logger.log(`${response} by ${message.author.username}#${message.author.discriminator}`);
			return response;
		})
	);

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'Staff'
};

exports.help = {
	name: 'mute',
	category: 'Moderation',
	description: 'Mutes a member indefinitely',
	usage: 'mute <reason...>'
};
