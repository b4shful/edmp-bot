/**
 * A feedback point is used to track when a guild member gives useful feedback
 * to someone in the feedback channel.
 * 
 * FeedbackPoints are usable within an hour after they are created. Afterwards
 * an hour the point expires and cannot be redeemed for requesting feedback.
 */
const Logger = require('../../util/Logger');

const ONE_HOUR = 60 * 60 * 1000;

const logQuery = (query, parameters) =>
	Logger.log(`Database operation:\n${query.trim()}\n${JSON.stringify(parameters, undefined, 2)}\n`);

// After one hour a FeedbackPoint may not be redeemed.
exports.TTL = ONE_HOUR;

/**
 * @param {Database} database
 * @param {string} userId
 * @param {string} message
 * @throws If execution of database statement fails
 */
exports.create = (database, userId, message) => {
	if (!database) {
		throw new TypeError('Expected a database connection.');
	}

	if (!userId || typeof userId !== 'string') {
		throw new TypeError('A FeedbackPoint requires a userId string');
	}

	if (!message || typeof message !== 'string') {
		throw new TypeError('A FeedbackPoint requires a message string');
	}

	const INSERT_POINT = `
		INSERT INTO FeedbackPoint (userId, message)
		VALUES ($userId, $message)
	`;

	const parameters = { userId, message };

	logQuery(INSERT_POINT, parameters);
	database
		.prepare(INSERT_POINT)
		.run(parameters);
};

/**
 * @param {Database} database
 * @param {string} userId
 * @throws If no usable points are found
 * @throws If execution of database statement fails
 */
exports.redeem = (database, userId) => {
	if (!database) {
		throw new TypeError('Expected a database connection.');
	}

	if (!userId || typeof userId !== 'string') {
		throw new TypeError('A FeedbackPoint requires a userId string');
	}

	// This could be simplified using an update query where UPDATE_DELETE_LIMIT
	// is enabled, but the that a custom compilation of sqlite3.

	const SELECT_OLDEST_USABLE_POINT = `
		SELECT id FROM FeedbackPoint
		WHERE userId = $userId
			AND timestamp > datetime('now', '-1 hour')
			AND used = 0
		ORDER BY timestamp DESC
		LIMIT 1
	`;

	const selectParameters = { userId };

	logQuery(SELECT_OLDEST_USABLE_POINT, selectParameters)
	const point = database.prepare(SELECT_OLDEST_USABLE_POINT)
		.get(selectParameters);

	if (!point) {
		throw new TypeError('You do not have any points available. Give someone else some feedback to earn a point to redeem.');
	}

	const UPDATE_USABLE_POINT = `
		UPDATE FeedbackPoint
		SET used = 1
		WHERE id = $id
	`;

	const updateParameters = { id: point.id };

	logQuery(UPDATE_USABLE_POINT, updateParameters)
	database.prepare(UPDATE_USABLE_POINT).run(updateParameters);
};

/**
 * @param {Database} database
 * @param {string} userId
 * @throws If execution of database statement fails
 */
exports.count = (database, userId) => {
	if (!database) {
		throw new TypeError('Expected a database connection.');
	}

	if (!userId || typeof userId !== 'string') {
		throw new TypeError('A FeedbackPoint requires a userId string');
	}

	const SELECT_USABLE_POINT_COUNT = `
		SELECT count(*) AS usablePoints
		FROM FeedbackPoint
			WHERE userId = $userId
			AND timestamp > datetime('now', '-1 hour')
			AND used = 0
	`;

	const parameters = { userId };

	logQuery(SELECT_USABLE_POINT_COUNT, parameters);
	const { usablePoints } = database.prepare(SELECT_USABLE_POINT_COUNT)
		.get(parameters);

	Logger.log(`User ${userId} has ${usablePoints} usable points`);
	return usablePoints;
};

/**
 * @param {Database} database
 * @param {string} userId
 * @throws If execution of database statement fails
 */
exports.all = (database, userId) => {
	if (!database) {
		throw new TypeError('Expected a database connection.');
	}

	if (!userId || typeof userId !== 'string') {
		throw new TypeError('A FeedbackPoint requires a userId string');
	}

	const SELECT_ALL_POINT_COUNT =
		"SELECT count(*) AS totalPoints FROM FeedbackPoint WHERE userId = $userId";

	const parameters = { userId };

	logQuery(SELECT_USABLE_POINT_COUNT, parameters);
	const { totalPoints } = database.prepare(SELECT_ALL_POINT_COUNT)
		.get(parameters);

	Logger.log(`User ${userId} has ${totalPoints} total points`);
	return totalPoints;
};
