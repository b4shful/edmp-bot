const Logger = require("../util/Logger");
const FeedbackRequest = require("../modules/feedback/FeedbackRequest");

const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm;

// Necessary bullshit to handle using the primary prefix for the help command
let prefix = "uninitialized";
let help = {};

exports.init = client => {
	prefix = client.config.defaultSettings.prefix[0];

	help = {
		name: "edit",
		category: "Feedback",
		description: "Edit a feedback request you have made.",
		usage: `${prefix} edit <id> <link to your track> <any comments...>`
	};

	exports.help = help;
};

/**
 * Removes the command and arguments from the message content.
 */
const stripCommandFromMessage = (requestId, messageContent) => {
	const idString = requestId.toString();
	const index = messageContent.indexOf(idString) + idString.length + 1;
	return messageContent.substr(index);
};

/**
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message, args) => {
	const { author, channel, member } = message;

	if (author.bot || !member) {
		return;
	}

	if (channel.name !== "feedback-trade") {
		const feedbackChannel = message.guild.channels.find("name", "feedback-trade") || "#feedback-trade";

		channel.send(`\`edit\` only works in ${feedbackChannel}.`);
		return;
	}

	const database = client.database;
	const requestId = parseInt(args[0]);

	if (!requestId) {
		channel.send(`${member} You must provide a valid request id to edit your request. Usage: \`${help.usage}\``);
		return;
	}

	// Check if the message edit is valid before running a query.

	const matches = message.content.match(regex);

	if (!matches || matches.length === 0) {
		channel.send(`${member} You need to provide a link to your track. Usage: \`${help.usage}\``);
		return;
	}

	if (matches.length > 1) {
		channel.send(`${member} You can only ask for feedback on one track per request. Usage: \`${help.usage}\``);
		return;
	}

	// TODO: Parse link if it's permitted (audio host whitelist).
	// TOTO: Check for 403/404/x0x
	// NOTE: For some services, check if the link is a playlist/set
	// and respond with a "you can only request feedback for one track".

	let request;
	try {
		request = FeedbackRequest.get(database, requestId);
	} catch (error) {
		Logger.error(error);
		channel.send("Something went wrong, please notify `@Mods`.");
		return;
	}

	if (!request) {
		channel.send(`${member} That request doesn't exist.`);
		return;
	}

	if (request.userId !== member.id) {
		channel.send(`${member} You did not make that request. Don't try to edit other people's requests.`);
		return;
	}

	try {
		const messageContent = stripCommandFromMessage(requestId, message.content);
		FeedbackRequest.update(database, requestId, messageContent);
	} catch (error) {
		Logger.error(error);
		channel.send("Something went wrong, please notify `@Mods`.");
		return;
	}

	channel.send(`${member} Your request has been updated.`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["update", "replace", "change"],
	permLevel: "User"
};
