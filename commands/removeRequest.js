const Logger = require("../util/Logger");
const FeedbackRequest = require("../modules/feedback/FeedbackRequest");

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

	let requestId;
	try {
		requestId = parseInt(args[0]);

		if (!requestId) {
			throw new TypeError(`${message.member} You must provide a valid request id to submit your feedback.`);
		}
	} catch (error) {
		message.channel.send(error.message);
		return;
	}

	let response;
	try {
		const removed = FeedbackRequest.remove(client.database, requestId);

		if (!removed) {
			response = "No FeedbackRequest with that id was found.";
		} else {
			const { member } = message;
			Logger.log(
				`${member.displayName} (${member.username}#${member.discriminator}) removed a FeedbackRequest ${requestId}`
			);

			response = `${member} Feedback request ${requestId} was removed.`;
		}
	} catch (error) {
		Logger.error(error);
		response = "Something went wrong, please notify `@Staff`.";
	}

	message.channel.send(response);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Mentor"
};

exports.help = {
	name: "removeRequest",
	category: "Feedback",
	description: "Removes an accepted feedback request. This is for moderation purposes and should not be used often.",
	usage: "removeRequest <requestId>"
};
