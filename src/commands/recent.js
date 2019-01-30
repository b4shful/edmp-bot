const Logger = require("../util/Logger");
const FeedbackRequest = require("../modules/feedback/FeedbackRequest");

const formatRequestList = (members, requests) => {
	const unchecked = "📡";
	const checked = "✅";

	const list = requests
		.map(request => {
			try {
				const status = request.comments > 0 ? checked : unchecked;
				const link = FeedbackRequest.getLink(request);
				const displayName = members.get(request.userId).displayName;
				return `${status} \`${request.id}\` ${displayName} - <${link}>`;
			} catch (error) {
				Logger.error(error);
				return "";
			}
		})
		.filter(item => item.length !== 0);

	if (!(list.length > 0)) {
		return "No one has requested feedback yet!";
	}
	return ["Recent feedback requests:", ...list].join("\n");
};

/**
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */ exports.run = (client, message) => {
	const { author, channel, guild, member } = message;

	if (author.bot || !member) {
		return;
	}
	if (channel.name !== "feedback-trade") {
		const feedbackChannel = guild.channels.find("name", "feedback-trade") || "#feedback-trade";

		channel.send(`\`recent\` only works in ${feedbackChannel}.`);
		return;
	}
	const requests = FeedbackRequest.recent(client.database, 6);
	channel.send(formatRequestList(guild.members, requests));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "recent",
	category: "Feedback",
	description: "",
	usage: "recent"
};
