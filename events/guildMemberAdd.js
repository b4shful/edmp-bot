const Logger = require('../util/Logger');

// We're using a command instead of a module here so we can reload any changes
// to the welcome message.
const Welcome = require('../commands/welcome');

/**
 * This event executes when a new member joins a server.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Member} member A message on Discord
 */
module.exports = (client, member) => {
	const { modLogChannel } = client.settings.get(member.guild.id);

	if (!modLogChannel) {
		Logger.error('`modLogChannel` is missing from bot configuration.');
	}

	member.guild.channels.find('name', modLogChannel)
		.send(`User ${member} joined EDMP.`)
		.catch(Logger.error);

	if (Welcome.conf.enabled) {
		Welcome.run(client, `${member}`);
	}
};
