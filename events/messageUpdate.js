const Logger = require('../util/Logger');

module.exports = (_client, oldMessage, newMessage) => {
	const { author, guild } = oldMessage;
	Logger.debug(`${author.username}#${author.discriminator} (${author.id}) message was edited`);
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

  const { channel, cleanContent: beforeContent } = oldMessage;
  const { cleanContent: afterContent } = newMessage;
	const { id, username, discriminator } = author;
	const logMessage = `${username}#${discriminator} (\`${id}\`) message edited in **#${channel.name}**:\n**B:** ${beforeContent}\n**A:** ${afterContent}`;
	Logger.log(logMessage);
	logChannel.send(logMessage);
};
