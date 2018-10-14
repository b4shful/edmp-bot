const Logger = require('../util/Logger');
const ModLogger = require('../util/ModLogger');

module.exports = (_client, oldMessage, newMessage) => {
	const { author } = oldMessage;
	Logger.debug(`${author.username}#${author.discriminator} (${author.id}) message was edited`);

	if (author.bot) { return; }

	const { guild, channel, cleanContent: beforeContent } = oldMessage;
	const { cleanContent: afterContent } = newMessage;
	const { id, username, discriminator } = author;

	ModLogger.log(guild, `${username}#${discriminator} (\`${id}\`) message edited in **#${channel.name}**:\n**B:** ${beforeContent}\n**A:** ${afterContent}`);
};
