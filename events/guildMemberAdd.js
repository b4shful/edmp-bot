const Logger = require("../util/Logger");

const welcomeMessage = (member, rulesChannel = "`#rules_and_how-to`") =>
	`Welcome to EDMP ${member}! Take a moment to read ${rulesChannel}, then tell \`@Staff\` what DAW you use to get access to the dozens of other channels we have available. Please be patient as staff may not be immediately available to give you your role(s), they sleep too!\n\nDon't produce? That's fine! Tell us if you're a vocalist, graphic artist, or just a music fan and you'll get access.`;

/**
 * This event executes when a new member joins a server.
 *
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Member} member A message on Discord
 */
module.exports = (client, member) => {
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
