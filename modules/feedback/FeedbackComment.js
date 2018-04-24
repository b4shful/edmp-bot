/**
 * A feedback comment is a message made in response to someone's feedback
 * request. It requires a reference to the feedback request, and should
 * reward a feedback point to the user making the comment.
 */
const logQuery = require('./utils').logQuery;

/**
 * @param {Database} database
 * @param {string} requestId
 * @returns {FeedbackRequest | undefined} The FeedbackRequest with `requestId`, or undefined if not found
 * @throws If execution of database statement fails
 */
const confirmRequestExists = (database, requestId) => {
	const SELECT_REQUEST = `SELECT * FROM FeedbackRequest WHERE id = $requestId`;
	const parameters = { requestId };

	logQuery(SELECT_REQUEST, parameters);
	return database.prepare(SELECT_REQUEST).get(parameters);
};

/**
 * @param {Database} database
 * @param {string} requestId
 * @param {string} userId
 * @returns {number} Number of FeedbackComments that exist for FeedbackRequest `requestId` by the user
 * @throws If execution of database statement fails
 */
const numComments = (database, requestId, userId) => {
	const SELECT_COMMENT = `SELECT count(*) as comments FROM FeedbackComment WHERE requestId = $requestId AND userId = $userId`;
	const parameters = { requestId, userId };

	logQuery(SELECT_COMMENT, parameters);
	const { comments } = database.prepare(SELECT_COMMENT).get(parameters);

	return comments;
};

exports.searchByUrl = (database, url) => {
	if (!database) {
		throw new TypeError('Expected a database connection.');
	}

	if (!url || typeof url !== 'string') {
		throw new TypeError('The url string is required to search.');
	}

	const query = `SELECT userId, timestamp, message FROM (SELECT id FROM FeedbackRequest WHERE message LIKE $pattern) requests JOIN FeedbackComment ON requests.id = FeedbackComment.requestId`;
	const parameters = { pattern: `%${url}%` };

	logQuery(query, parameters);
	return database.prepare(query).all(parameters);
};

/**
 * @param {Database} database
 * @param {number} requestId
 * @param {string} userId
 * @param {string} message
 * @returns {Object} An object with flags indicating invalid state for creation or confirmation.
 * - `created` means the FeedbackComment was created successfully
 * - `selfFeedback` means the comment was for a user's own FeedbackRequest and the comment was not created
 * - `requestNotFound` means the comment was for a FeedbackRequest that does not exist
 * - `extraFeedback` means another comment for the FeedbackReqeusts already exists by the user
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

	let result = {
		created: false,
		selfFeedback: false,
		requestNotFound: false,
		extraFeedback: false
	};

	const request = confirmRequestExists(database, requestId);

	if (!request) {
		return { ...result, requestNotFound: true };
	}

	if (request.userId === userId) {
		return { ...result, selfFeedback: true };
	}

	const count = numComments(database, requestId, userId);
	
	if (count > 0) {
		result = { ...result, extraFeedback: true };
	}

	const INSERT_COMMENT = `INSERT INTO FeedbackComment (requestId, userId, message) VALUES ($requestId, $userId, $message)`;
	const parameters = { requestId, userId, message };

	logQuery(INSERT_COMMENT, parameters);
	database.prepare(INSERT_COMMENT).run(parameters);

	return { ...result, created: true };
};
