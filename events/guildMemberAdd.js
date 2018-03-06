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
	if (Welcome.conf.enabled) {
		Welcome.run(client, `${member}`);
	}
};
