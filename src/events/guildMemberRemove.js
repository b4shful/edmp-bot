const Logger = require("../util/Logger");
const ModLogger = require("../util/ModLogger");

const { onGuildMemberRemove: createBackup } = require("../modules/moderation/events");

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

	if (bot) { return; }

	createBackup(client.database, member);

	ModLogger.log(guild, `${username}#${discriminator} (\`${id}\`) left the server`);
};
