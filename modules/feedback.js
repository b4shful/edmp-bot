const Enmap = require("enmap");
const EnmapSqlite = require('enmap-sqlite');

const Logger = require('../util/Logger');

module.exports = async client => {
	Logger.log('Adding feedback module...');

	collection = new Enmap({
		provider: new EnmapSqlite({ name: 'feedback-points' })
	});

	await collection.defer

	const close = collection.close;
	process.on('exit', code => close());
	process.on('uncaughtException', err => close());
	process.on('unhandledRejection', err => close());

	client.feedbackPoints = collection;

	Logger.log('Successfully added feedback module to client.');
};
