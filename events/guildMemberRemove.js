const Logger = require("../util/Logger");
const { onGuildMemberRemove: createBackup } = require('../modules/moderation/events');

/**
 * This event executes when a member has left, or been kicked from, the server.
 */
module.exports = (client, member) => {
	const {
		id,
		user: { bot, username, discriminator },
		guild
	} = member;

	Logger.debug(`${username}#${discriminator} (${id}) left the server`);
	if (bot || !guild || !guild.available) return;

	createBackup(client.database, member);

	const logChannel = guild.channels.find(({ type, name }) => type === "text" && name === "logs-general");

	if (!logChannel) {
		Logger.warn("Unable to find logging channel in server");
		return;
	}

	const logMessage = `${username}#${discriminator} (\`${id}\`) left the server`;

	Logger.log(logMessage);
	logChannel.send(logMessage);
};