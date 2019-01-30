const Logger = require("../../util/Logger");

exports.SQLITE_FALSE = 0;
exports.SQLITE_TRUE = 1;

exports.logQuery = (query, parameters) =>
	Logger.log(`Database operation:\n${query.trim()}\n${JSON.stringify(parameters, undefined, 2)}\n`);

exports.getUserForId = (database, id) => {
	const SELECT_USERID_FOR_ID = "select userId from FeedbackRequest where id = $id;";

	const selectParameters = { id };

	module.exports.logQuery(SELECT_USERID_FOR_ID, selectParameters);
	const returnUser = database.prepare(SELECT_USERID_FOR_ID).get(selectParameters).userId;

	if (!returnUser) {
		throw new TypeError("No user was found for a given ID in getUserForId.");
	}

	return returnUser;
};
