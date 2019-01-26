/**
 * A member backup tracks the last known state of a member of the guild.
 *
 * Storing member information to the database allows for role recovery and
 * mute persistence should the member leave the server and rejoin.
 */


// Restore occcur on:
// - GuildMemberAdd
// - Manual restore

// Backup updates occur on:
// - GuildMemberRemove

const serializeMember = member => ({
	userId: member.user.id,
	nickname: member.nickname,
	roles: JSON.stringify(member.roles.filter(role => role.name !== "@everyone").keyArray()),
	muted: member.serverMute ? 1 : 0,
	deaf: member.serverDeaf ? 1 : 0
});

exports.deserializeMember = ({
	id,
	nickname,
	roles, // string
	muted, // number
	deaf // number
}) => ({
	userId: id,
	nickname,
	roles: JSON.parse(roles), // Array of role ids
	muted: muted > 0 ? true : false,
	deaf: deaf > 0 ? true : false
});

/**
 * @param {Databse} database
 * @param {Discord.GuildMember} member
 * 
 * @returns Id of newly created GuildMemberBackup
 *
 * @throws If execution of a database statement fails
*/
exports.create = (database, member) => {
	if (!database) {
		throw new TypeError("Expected a database connection");
	}

	if (!member) {
		throw new TypeError("Expected a Discord guild member");
	}

	const UPDATE_BACKUP = "INSERT INTO GuildMemberBackup (id, nickname, roles, muted, deaf) VALUES ($userId, $nickname, $roles, $muted, $deaf)";
	const parameters = serializeMember(member);

	const { lastInsertROWID } = database.prepare(UPDATE_BACKUP).run(parameters);
	return lastInsertROWID;
};

/**
 * @param {Databse} database
 * @param {Discord.GuildMember} member
 * 
 * @returns {Object | undefined} GuildMemberBackup with the user id of the given `member`
 *
 * @throws If execution of a database statement fails
*/
exports.get = (database, member) => {
	if (!database) {
		throw new TypeError("Expected a database connection");
	}

	if (!member) {
		throw new TypeError("Expected a Discord guild member");
	}

	const GET_BACKUP = "SELECT * FROM GuildMemberBackup WHERE id = $userId";
	const parameters = { userId: member.user.id };

	return database.prepare(GET_BACKUP).get(parameters);
};

/**
 * @param {Databse} database
 * @param {Discord.GuildMember} member
 * 
 * @returns {Object} Changes made to the GuildMemberBackup with the user id of the given `member`
 *
 * @throws If execution of a database statement fails
*/
exports.update = (database, member) => {
	if (!database) {
		throw new TypeError("Expected a database connection");
	}

	if (!member) {
		throw new TypeError("Expected a Discord guild member");
	}

	const UPDATE_BACKUP = "UPDATE GuildMemberBackup SET nickname = $nickname, roles = $roles, muted = $muted, deaf = $deaf WHERE id = $userId";
	const parameters = serializeMember(member);

	const { changes } = database.prepare(UPDATE_BACKUP).run(parameters);
	return changes;
};
