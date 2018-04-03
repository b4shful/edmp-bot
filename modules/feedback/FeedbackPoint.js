/**
 * A feedback point is used to track when a guild member gives useful feedback
 * to someone in the feedback channel.
 * 
 * FeedbackPoints are usable within an hour after they are created. Afterwards
 * an hour the point expires and cannot be redeemed for requesting feedback.
 */
const Logger = require('../../util/Logger');
const { SQLITE_FALSE } = require('./utils');

const ONE_HOUR = 60 * 60 * 1000;

const logQuery = (query, parameters) =>
	Logger.log(`Database operation:\n${query.trim()}\n${JSON.stringify(parameters, undefined, 2)}\n`);


// After one hour a FeedbackPoint may not be redeemed.
exports.TTL = ONE_HOUR;

exports.create = async (database, userId, message) => {
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
		VALUES ($userId, $message);
	`;

	const parameters = {
		$userId: userId,
		$message: message
	};

	logQuery(INSERT_POINT, parameters);
	await database.run(INSERT_POINT, parameters);
};

exports.redeem = async (database, userId) => {
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
		LIMIT 1;
	`;

	const selectParameters = { $userId: userId };

	logQuery(SELECT_OLDEST_USABLE_POINT, selectParameters)
	const point =
		await database.get(SELECT_OLDEST_USABLE_POINT, selectParameters);

	if (!point) {
		throw new TypeError('You do not have any points available.');
	}

	const UPDATE_USABLE_POINT = `
		UPDATE FeedbackPoint
		SET used = 1
		WHERE id = $id;
	`;

	const updateParameters = { $id: point.id };

	logQuery(UPDATE_USABLE_POINT, updateParameters)
	await database.run(UPDATE_USABLE_POINT, updateParameters);
};

exports.count = async (database, userId) => {
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
			AND timestamp > datetime('now', '-1 hour');
	`;

	const parameters = { $userId: userId };

	logQuery(SELECT_USABLE_POINT_COUNT, parameters);
	const { usablePoints } =
		await database.get(SELECT_USABLE_POINT_COUNT, parameters);

	Logger.log(`User ${userId} has ${usablePoints} usable points`);
	return usablePoints;
};

exports.all = async (database, userId) => {
	if (!database) {
		throw new TypeError('Expected a database connection.');
	}

	if (!userId || typeof userId !== 'string') {
		throw new TypeError('A FeedbackPoint requires a userId string');
	}

	const SELECT_ALL_POINT_COUNT =
		"SELECT count(*) AS totalPoints FROM FeedbackPoint WHERE userId = $userId;";

	const { totalPoints } =
		await database.get(SELECT_ALL_POINT_COUNT, { $userId: userId });

	Logger.log(`User ${userId} has ${totalPoints} total points`);
	return totalPoints;
};
