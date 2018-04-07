const FeedbackPoint = require('./FeedbackPoint');

const validateClient = client => {
	if (!client.database) {
		throw new TypeError('Database is missing.');
	}

	if (!client.database.open) {
		throw new TypeError('Database connection is not open.');
	}
};

const CREATE_FEEDBACK_POINT_TABLE = `CREATE TABLE IF NOT EXISTS FeedbackPoint(
	id INTEGER PRIMARY KEY,
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Unix Epoch in seconds
	userId INTEGER NOT NULL,
	used INTEGER DEFAULT 0 NOT NULL, -- boolean, 0 = false, 1 = true
	message TEXT NOT NULL
);`;

/**
 * @param {Database} database
 * @throws If execution of statement fails
 */
const createPointTable = database =>
	database.prepare(CREATE_FEEDBACK_POINT_TABLE).run();

/**
 * @param {Database} database
 * @throws If execution of statement fails
 */
const validateTables = database => {
	createPointTable(database);
};

/**
 * @param {*} client
 * @throws If database is not found, or not open, in the client
 * @throws If execution of database statement fails
 */
module.exports = client => {
	client.logger.log('Adding feedback module...');

	validateClient(client);
	validateTables(client.database);

	client.logger.log('Successfully added feedback module to client.');
};
