const Logger = require('../util/Logger');
const {
	getMentionedMember,
	ignoreBots,
	respond
} = require('../modules/moderation/utils');

exports.run = (_client, message, args) =>
	ignoreBots(message,
		() => respond(message, async () => {
			const member = getMentionedMember(message);

			if (message.author.id === member.user.id) {
				throw new TypeError('Don\'t mute yourself');
			}

			if (member.serverMute) {
				throw new TypeError('Member is already muted in this server');
			}

			let reason = 'No reason';

			// Only one mentioned allowed, so following tokens are reason message.
			if (args.length > 1) {
				reason = `${args.slice(1).join(' ')}`;
			}

			try {
				await member.setMute(true, reason);
			}
			catch (error) {
				throw new TypeError(`Unable to mute user: ${error.message}`);
			}

			const response = `${member.displayName} (${member.user.username}#${member.user.discriminator}) was muted (\`${reason}\`)`;
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
