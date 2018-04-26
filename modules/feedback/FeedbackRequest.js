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

	const SELECT_RECENT = `SELECT FeedbackRequest.*, count(FeedbackComment.requestId) as comments FROM FeedbackRequest LEFT JOIN FeedbackComment ON FeedbackRequest.id = FeedbackComment.requestId GROUP BY FeedbackRequest.id ORDER BY timestamp DESC LIMIT $length`;
	const parameters = { length };

	logQuery(SELECT_RECENT, parameters);
	return database.prepare(SELECT_RECENT).all(parameters);
};

const URL_PATTERN = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

/**
 * Parses a FeedbackRequest message for the submitted track URL.
 * @param {FeedbackRequest} request
 * @returns {string} URL found in the message content
 * @throws If no URL is found in the message content
 */
exports.getLink = request => {
	const { message } = request;

	const result = request.message.match(URL_PATTERN);

	if (!result) {
		throw new TypeError('FeedbackRequest message has no URL. This shouldn\'t have entered the database.');
	}

	return result[0];
};

/**
 * @param {Database} database
 * @param {number} requestId
 * @returns {boolean} If the request was found and deleted along with it's associated comments
 * @throws If execution of database statement fails
 */
exports.remove = (database, requestId) => {
	if (!database) {
		throw new TypeError('Expected a database connection.');
	}

	if (!requestId || typeof requestId !== 'number') {
		throw new TypeError('An id number is required to remove a FeedbackRequest');
	}

	const SELECT_REQUEST = `
		SELECT id FROM FeedbackRequest
		WHERE id = $id
		LIMIT 1
	`;

	const selectParameters = { id: requestId };

	logQuery(SELECT_REQUEST, selectParameters)
	const request = database.prepare(SELECT_REQUEST)
		.get(selectParameters);

	if (!request) { return false; }

	const DELETE_REQUEST_COMMENTS = `
		DELETE FROM FeedbackComment
		WHERE requestId = $id
	`;

	const deleteCommentsParameters = { id: request.id };

	logQuery(DELETE_REQUEST_COMMENTS, deleteCommentsParameters);
	database.prepare(DELETE_REQUEST_COMMENTS).run(deleteCommentsParameters);


	const DELETE_REQUEST = `
		DELETE FROM FeedbackRequest
		WHERE id = $id
	`;

	const parameters = { id: request.id };

	logQuery(DELETE_REQUEST, parameters);
	database.prepare(DELETE_REQUEST).run(parameters);

	return true;
};
