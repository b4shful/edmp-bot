const Logger = require('../util/Logger');

module.exports = (_client, guild, user) => {
	const { id, bot, username, discriminator } = user;
	Logger.debug(`${username}#${discriminator} (${id}) member was unbanned`);
	if (bot || !guild || !guild.available) return;

	const logChannel = guild.channels.find(({ type, name }) =>
		type === 'text' && name === 'logs-general'
	);

	if (!logChannel) {
		Logger.warn('Unable to find logging channel in server');
		return;
	}

	const logMessage = `${username}#${discriminator} (\`${id}\`) was unbanned`;

	Logger.log(logMessage);
	logChannel.send(logMessage);
};
