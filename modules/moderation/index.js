const validateClient = client => {
	if (!client.database) {
		throw new TypeError("Database is missing.");
	}

	if (!client.database.open) {
		throw new TypeError("Database connection is not open.");
	}
};

/**
 * This is similar to Rowboat's [GuildMemberBackup table](https://github.com/b1naryth1ef/rowboat/blob/master/rowboat/models/guild.py#L240).
 * 
 * In Rowboat, the primary key is a composite key of the user id and guild id.
 * The table would track the list of role ids associated with the user,
 * the user's nickname in the guild, whether they're muted in voice, and whether they were deaf in voice.
 * 
 * The Discord.js collections are Maps but they'll be serialized as a JSON object.
 */
const CREATE_MEMBER_BACKUPS_TABLE = `CREATE TABLE IF NOT EXISTS GuildMemberBackup(
	id INTEGER PRIMARY KEY, -- userId
	nickname STRING NULL, -- member's nickname
	roles STRING DEFAULT '[]', -- Sqlite doesn't support arrays, so we'll store it as a string; yay JSON!
	muted INTEGER DEFAULT 0 NOT NULL, -- boolean, 0 = false, 1 = true
	deaf INTEGER DEFAULT 0 NOT NULL -- boolean, 0 = false, 1 = true
)`;

/**
 * @param {Database} database
 * @throws If execution of statement fails
 */
const createMemberBackupsTable = database => database.prepare(CREATE_MEMBER_BACKUPS_TABLE).run();

/**
 * @param {Database} database
 * @throws If execution of statement fails
 */
const validateTables = database => {
	createMemberBackupsTable(database);
};

/**
 * @param {*} client
 * @throws If database is not found, or not open, in the client
 * @throws If execution of database statement fails
 */
module.exports = client => {
	client.logger.log("Adding moderation module...");

	validateClient(client);
	validateTables(client.database);

	client.logger.log("Successfully added moderation module to client.");
};
