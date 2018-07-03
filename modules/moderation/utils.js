/**
 * @param {Discord.Message} message
 * @returns {Discord.GuildMember} The first mentioned member in the server
 * @throws {TypeError} When no server member is mentioned
 */
exports.getMentionedMember = message => {
	const mentionedMembers = message.mentions.members;
	const error = new TypeError("No server members were mentioned.");

	if (!mentionedMembers) {
		throw error;
	}

	const firstMentionedMember = mentionedMembers.first();

	if (!firstMentionedMember) {
		throw error;
	}

	return firstMentionedMember;
};

/**
 * Higher-order function to ignore messages from bot users.
 * 
 * @param {Discord.Message} message 
 */
exports.ignoreBots = (message, callback) => {
	if (!message.author.bot) {
		callback();
	}
};

/**
 * Handles sending a message response using the given callback.
 *
 * @param {Discord.Message} message A Discord message
 * @param {() => Discord.StringResolvable} callback A function that will return
 * any type that can resolve to a string to be sent to a Discord GuildChannel
 */
exports.respond = async (message, callback) => {
	let response;
	try {
		response = await callback();
	} catch (error) {
		const { message: msg = "Unable to parse message." } = error;
		response = msg;
	} finally {
		message.channel.send(response);
	}
};
