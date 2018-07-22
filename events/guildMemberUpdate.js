const Logger = require('../util/Logger');

module.exports = (_client, oldMember, newMember) => {
	const { user: { id, bot, username, discriminator }, guild } = oldMember;
	Logger.debug(`${username}#${discriminator} (${id}) member was edited`);
	if (bot || !guild || !guild.available) return;

	const logChannel = guild.channels.find(({ type, name }) =>
		type === 'text' && name === 'logs-general'
	);

	if (!logChannel) {
		Logger.warn('Unable to find logging channel in server');
		return;
	}

	const { displayName: oldName } = oldMember;
	const { displayName: newName } = newMember;
	const logMessage = `${username}#${discriminator} (\`${id}\`) changed name from \`${oldName}\` to \`${newName}\``;

	Logger.log(logMessage);
	logChannel.send(logMessage);
};
