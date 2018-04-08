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
