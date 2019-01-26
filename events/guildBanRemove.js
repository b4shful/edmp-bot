const Logger = require("../util/Logger");
const ModLogger = require("../util/ModLogger");

module.exports = (_client, guild, user) => {
	const { id, bot, username, discriminator } = user;
	Logger.debug(`${username}#${discriminator} (${id}) member was unbanned`);

	if (bot) { return; }

	ModLogger.log(guild, `${username}#${discriminator} (\`${id}\`) was unbanned`);
};
