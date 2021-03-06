const Logger = require("../util/Logger");
const ModLogger = require('../util/ModLogger');

const { onGuildMemberAdd: restoreUser } = require('../modules/moderation/events');

const welcomeMessage = (member, rulesChannel = "`#rules_and_how-to`") =>
	`Welcome to EDMP ${member}! Take a moment to read ${rulesChannel}.

Although we are named after our official parent - /r/edmproduction - we're inclusive of discussing and producing **ALL** music styles, so make yourself at home!

To access the rest of the server please type \`$selfrole\` followed by the name of your DAW. If you don't have a DAW or don't produce then use \`$selfrole fam\`.

Please ping @Staff if you need assistance, we're here to help. Thanks!`;

const welcome = (client, member) => {
	const { modLogChannel, welcomeEnabled, welcomeChannel } = client.settings.get(member.guild.id);

	// If welcome is off, don't proceed (don't welcome the user)
	if (welcomeEnabled !== "true") {
		Logger.error("Welcome message is not enabled in bot configuration.");
		return;
	}

	if (!welcomeChannel) {
		Logger.error("`welcomeChannel` is missing from bot configuration.");
		return;
	}

	if (!modLogChannel) {
		Logger.error("`modLogChannel` is missing from bot configuration.");
		return;
	}

	const rulesChannel = member.guild.channels.find("name", "rules_and_how-to");

	if (!rulesChannel) {
		Logger.error("The `rules_and_how-to` channel is missing.");
	}

	const message = welcomeMessage(member, rulesChannel);

	member.guild.channels
		.find("name", modLogChannel)
		.send(`User ${member} joined EDMP.`)
		.catch(Logger.error);

	member.guild.channels
		.find("name", welcomeChannel)
		.send(message)
		.catch(Logger.error);
};

/**
 * This event executes when a new member joins a server.
 *
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Member} member A message on Discord
 */
module.exports = (client, member) => {
	const {
		user: { id, username, discriminator },
		guild
	} = member;

	Logger.debug(`${username}#${discriminator} (${id}) joined the server`);
	ModLogger.log(guild, `${username}#${discriminator} (\`${id}\`) joined the server`);

	restoreUser(client.database, member);
	welcome(client, member);
};
