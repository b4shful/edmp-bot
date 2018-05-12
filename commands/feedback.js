const Logger = require("../util/Logger");
const FeedbackPoint = require("../modules/feedback/FeedbackPoint");
const FeedbackComment = require("../modules/feedback/FeedbackComment");
const Utilities = require("../Modules/feedback/utils");

// Necessary bullshit to handle using the primary prefix for the help command
let prefix = "uninitialized";
let help = {};

exports.init = client => {
	prefix = client.config.defaultSettings.prefix[0];

	help = {
		name: "feedback",
		category: "Feedback",
		description:
			"Submits a feedback for the track with the given request ID. If your feedback is acceptable you will receive a point.",
		usage: `${prefix} feedback <request ID> <your feedback...>`
	};

	exports.help = help;
};

/**
 * NOTE: Unused for the time being.
 */
const mentionsMember = message => {
	const { mentions } = message;
	const { everyone, roles, members } = mentions;

	if (everyone) {
		throw new TypeError("You can't give feedback to everyone... or at least not at once.");
	}

	if (roles.size > 0) {
		throw new TypeError("Mention who you want to give feedback to, not their role(s).");
	}

	if (!members || members.size <= 0) {
		throw new TypeError("Mention who you are giving feedback to in order to receive a point.");
	}

	if (members.size > 1) {
		throw new TypeError("Give feedback to one person at a time.");
	}
};

const isAcceptable = feedback => {
	// TODO: Determine a more sophisticated solution for determining what is
	// acceptable feedback.
	if (feedback.length < 140) return false;

	return true;
};

/**
 * Removes the command and arguments from the message content.
 */
const stripCommandFromMessage = (requestId, messageContent) => {
	const index = messageContent.indexOf(requestId) + requestId.toString().length + 1;
	return messageContent.substr(index);
};

/**
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = async (client, message, args) => {
	if (message.author.bot || !message.member) {
		return;
	}

	if (message.channel.name !== "feedback-trade") {
		const feedbackChannel = message.guild.channels.find("name", "feedback-trade") || "#feedback-trade";

		message.channel.send(`\`${help.name}\` only works in ${feedbackChannel}.`);
		return;
	}

	const database = client.database;
	const userId = message.member.id;

	let commentResult;
	let response;

	const requestId = parseInt(args[0]);
	const messageContent = stripCommandFromMessage(requestId, message.content);

	if (!requestId) {
		response = `${message.member} You must provide a valid request id to submit your feedback. Usage: \`${
			help.usage
		}\``;
	}

	if (!response && !isAcceptable(messageContent)) {
		response = `${message.member} The feedback you gave is really short, please be more constructive.`;
	}

	if (!response) {
		try {
			commentResult = FeedbackComment.create(database, requestId, userId, messageContent);
		} catch (error) {
			Logger.error(error);
			response = "Something went wrong, please notify `@Staff`.";
		}
	}

	if (!response && commentResult.selfFeedback) {
		await message.delete();
		response = `${message.member} Don't give feedback to yourself for points...`;
	}

	if (!response && commentResult.requestNotFound) {
		response = `${message.member} That track doesn't exists.`;
	}

	let fbReceiver = Utilities.getUserForId(database, requestId);

	// We only get here in really strange circumstances. If this happens, pray to god that you can fix it.
	if (!response && !fbReceiver && !commentResult.requestNotFound) {
		response =
			"There was a catastrophic database error that may result in total protonic reversal. Please contact @Staff. NOW!";
	}

	if (!response && commentResult.created && commentResult.extraFeedback) {
		response = `${message.member} Your feedback was added for ${client.users.get(
			fbReceiver
		)}'s track, but you already received a point for this track.`;
	}

	if (!response && commentResult.created && fbReceiver) {
		try {
			FeedbackPoint.create(database, userId, messageContent);

			Logger.log(
				`${message.member.displayName} (${message.author.username}#${
					message.author.discriminator
				}) received a FeedbackPoint for giving feedback`
			);

			response = `${message.member} has been rewarded a point for giving feedback to ${client.users.get(fbReceiver)}`;
		} catch (error) {
			Logger.error(error);
			response = "Something went wrong, please notify `@Staff`.";
		}
	}

	message.channel.send(response);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};
