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
 * @param {Discord.Message} message A Discord message
 * @returns {Discord.Guild} The Discord server
 * @throws {TypeError} If the guild is not included in the message
 */
exports.getGuild = message => {
	const { guild } = message;

	if (!guild) {
		throw new TypeError("This command is only available in the server.");
	}

	return guild;
};

exports.isMutedInServer = member => {
	const role = member.roles.find("name", "Muted");

	return role ? true : false;
};

exports.muteInServer = async (guild, member, reason) => {
	const role = guild.roles.find("name", "Muted");

	if (!role) {
		throw new TypeError("Mute is not set up on this server");
	}

	if (exports.isMutedInServer(member)) {
		throw new TypeError("Member is already muted");
	}

	return member.addRole(role, reason);
};

exports.unmuteInServer = async (guild, member) => {
	const role = guild.roles.find("name", "Muted");

	if (!role) {
		throw new TypeError("Mute is not set up on this server");
	}

	if (!exports.isMutedInServer(member)) {
		throw new TypeError("Member is not muted");
	}

	return member.removeRole(role);
};

exports.banUser = async (member, reason) => {
	return member.ban(reason);
};

exports.unbanUser = async (guild, user) => {
	return guild.unban(user);
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
