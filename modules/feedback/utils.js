const Logger = require("../../util/Logger");

exports.SQLITE_FALSE = 0;
exports.SQLITE_TRUE = 1;

exports.logQuery = (query, parameters) =>
	Logger.log(`Database operation:\n${query.trim()}\n${JSON.stringify(parameters, undefined, 2)}\n`);
