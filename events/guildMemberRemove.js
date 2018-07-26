const Logger = require("../util/Logger");

/**
 * This event executes when a member has left, or been kicked from, the server.
 */
module.exports = (_client, member) => {
	const {
		id,
		user: { username },
		user: { discriminator },
		guild
	} = member;

	Logger.debug(`${username}#${discriminator} (${id}) left the server`);
	if (bot || !guild || !guild.available) return;

	const logChannel = guild.channels.find(({ type, name }) => type === "text" && name === "logs-general");

	if (!logChannel) {
		Logger.warn("Unable to find logging channel in server");
		return;
	}

	const logMessage = `${username}#${discriminator} (\`${id}\`) left the server`;

	Logger.log(logMessage);
	logChannel.send(logMessage);
};
