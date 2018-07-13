const Logger = require('../util/Logger');
const {
	getGuild,
	getMentionedMember,
	unmuteInServer,
	ignoreBots,
	respond
} = require('../modules/moderation/utils');

exports.run = (_client, message) =>
	ignoreBots(message, () =>
		respond(message, async () => {
			const guild = getGuild(message);
			const member = getMentionedMember(message);

			if (message.author.id === member.user.id) {
				throw new TypeError('Like I would let you');
			}

			if (message.mentions.members.length > 1) {
				throw new TypeError('Please unmute one person at a time');
			}

			try {
				await unmuteInServer(guild, member);
			}
			catch (error) {
				throw new TypeError(`Unable to unmute user: ${error.message}`);
			}

			const response = `${member.displayName} (\`${member.user.username}#${member.user.discriminator}\`) was unmuted`;
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
	name: 'unmute',
	category: 'Moderation',
	description: 'Unmutes a member',
	usage: 'unmute <reason...>'
};
