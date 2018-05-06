exports.run = async (client, message) => {
	message.author.send(`You must use the bot, bro`);
	message.delete(0);
};

// Filters can have channelIDs as a single string or an array of strings.
// This applies the filter to all IDs listed.
exports.help = {
	name: "Feedback",
	channelID: ["feedback-trade"]
};
