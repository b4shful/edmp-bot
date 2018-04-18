/**
 * A feedback comment is a message made in response to someone's feedback
 * request. It requires a reference to the feedback request, and should
 * reward a feedback point to the user making the comment.
 */
const logQuery = require('./utils').logQuery;

/**
 * @param {Database} database
 * @param {string} requestId
 * @returns {FeedbackRequest} The FeedbackRequest with `requestId`
 * @throws If a FeedbackRequest with `requestId` does not exist
 * @throws If execution of database statement fails
 */
const confirmRequestExists = (database, requestId) => {
	const SELECT_REQUEST = `SELECT * FROM FeedbackRequest WHERE id = $requestId`;
	const selectParameters = { requestId };

	logQuery(SELECT_REQUEST, selectParameters);
	const request = database.prepare(SELECT_REQUEST).get(selectParameters);

	if (!request) {
		throw new TypeError('Must reference an existing feedback request.');
	}

	return request;
};

/**
 * @param {Database} database
 * @param {number} requestId
 * @param {string} userId
 * @param {string} message
 * @returns {boolean} `true` if the request was found and a comment was created, `false` if the userId for the comment is for a FeedbackRequest with the same userId
 * @throws If a FeedbackRequest with `requestId` does not exist
 * @throws If execution of database statement fails
 */
exports.create = (database, requestId, userId, message) => {
	if (!database) {
		throw new TypeError('Expected a database connection.');
	}

	if (!requestId || typeof requestId !== 'number') {
		throw new TypeError('A FeedbackComment requires a requestId number');
	}

	if (!userId || typeof userId !== 'string') {
		throw new TypeError('A FeedbackComment requires a userId string');
	}

	if (!message || typeof message !== 'string') {
		throw new TypeError('A FeedbackComment requires a message string');
	}

	const request = confirmRequestExists(database, requestId);

	if (request.userId === userId) {
		return false;
	}

	const INSERT_COMMENT = `INSERT INTO FeedbackComment (requestId, userId, message) VALUES ($requestId, $userId, $message)`;
	const parameters = { requestId, userId, message };

	logQuery(INSERT_COMMENT, parameters);
	database.prepare(INSERT_COMMENT).run(parameters);

	return true;
};
