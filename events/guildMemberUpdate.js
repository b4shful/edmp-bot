const Logger = require("../util/Logger");
const ModLogger = require("../util/ModLogger");

module.exports = (_client, oldMember, newMember) => {
	const { user: { id, bot, username, discriminator }, guild } = oldMember;
	Logger.debug(`${username}#${discriminator} (${id}) member was edited`);

	if (bot) { return; }

	const { displayName: oldName } = oldMember;
	const { displayName: newName } = newMember;

	ModLogger.log(guild, `${username}#${discriminator} (\`${id}\`) changed name from \`${oldName}\` to \`${newName}\``);
};
