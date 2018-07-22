const Logger = require('../util/Logger');

module.exports = (_client, message) => {
	const { author, guild } = message;
	Logger.debug(`${author.username}#${author.discriminator} (${author.id}) message was deleted`);
	if (author.bot || !guild || !guild.available) {
		return;
	}

	const logChannel = guild.channels.find(({ type, name }) =>
		type === 'text' && name === 'logs-general'
	);

	if (!logChannel) {
		Logger.warn('Unable to find logging channel in server');
		return;
	}

	const { channel, cleanContent } = message;
	const { id, username, discriminator } = author;
	const logMessage = `${username}#${discriminator} (\`${id}\`) message deleted in **#${channel.name}**:\n${cleanContent}`;
	Logger.log(logMessage);
	logChannel.send(logMessage);
};
