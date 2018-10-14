const Logger = require('../util/Logger');
const ModLogger = require('../util/ModLogger');

module.exports = (_client, message) => {
	const { author } = message;
	Logger.debug(`${author.username}#${author.discriminator} (${author.id}) message was deleted`);

	if (author.bot) { return; }

	const { guild, channel, cleanContent } = message;
	const { id, username, discriminator } = author;

	ModLogger.log(guild, `${username}#${discriminator} (\`${id}\`) message deleted in **#${channel.name}**:\n${cleanContent}`);
};
