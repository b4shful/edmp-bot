/**
 * A feedback request is created by a user when a feedback point is redeemed.
 * The request has a unique id that is used for tracking comments made about
 * a request.
 */
const logQuery = require('./utils').logQuery;

/**
 * @param {Database} database
 * @param {string} userId
 * @param {string} message
 * @returns Id of newly created FeedbackRequest
 * @throws If execution of database statement fails
 */
exports.create = (database, userId, message) => {
	if (!database) {
		throw new TypeError('Expected a database connection.');
	}

	if (!userId || typeof userId !== 'string') {
		throw new TypeError('A FeedbackRequest requires a userId string');
	}

	if (!message || typeof message !== 'string') {
		throw new TypeError('A FeedbackRequest requires a message string');
	}

	const INSERT_REQUEST = `INSERT INTO FeedbackRequest (userId, message) VALUES ($userId, $message)`;
	const parameters = { userId, message };

	logQuery(INSERT_REQUEST, parameters);
	const { lastInsertROWID } = database.prepare(INSERT_REQUEST)
		.run(parameters);

	return lastInsertROWID;
};

/**
 * @param {Database} database
 * @param {number} length
 * @returns List of the `length` most recent FeedbackRequests
 * @throws If execution of database statement fails
 */
exports.recent = (database, length) => {
	if (!database) {
		throw new TypeError('Expected a database connection.');
	}

	if (!length || typeof length !== 'number') {
		throw new TypeError('Missing number of requests to retreive.');
	}

	const SELECT_RECENT = `SELECT * FROM FeedbackRequest
	ORDER BY timestamp DESC
	LIMIT $length`;
	const parameters = { length };

	logQuery(SELECT_RECENT, parameters);
	return database.prepare(SELECT_RECENT).all(parameters);
};
