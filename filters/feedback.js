exports.run = async (client, message) => {};

// Filters can have channelIDs as a single string or an array of strings.
// This applies the filter to all IDs listed.
exports.help = {
	name: "Feedback",
	allowCategory: "All",
	//allowCommands: ["points", "recent"],
	channelID: ["feedback-trade"]
};
