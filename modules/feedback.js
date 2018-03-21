const Enmap = require("enmap");
const EnmapSqlite = require('enmap-sqlite');

const Logger = require('../util/Logger');

module.exports = async client => {
	Logger.log('Adding feedback module...');

	// The names that will be parsed into sqlite table names, and what the
	// collection will be known as on the client object.
	const names = ['feedbackPoints', 'feedbackQueue'];

	Logger.log('Creating feedback module collections...');
	const collections = Enmap.multi(names, EnmapSqlite);

	Object.entries(collections).forEach(async ([name, collection]) => {
		Logger.log(`Setting up ${name} collection...`);
		await collection.defer;
		Logger.log(`${collection.size} keys were loaded into ${name}`);

		const close = collection.close;
		process.on('exit', code => close());
		process.on('uncaughtException', err => close());
		process.on('unhandledRejection', err => close());

		client[name] = collection;
		Logger.log(`Successfully added ${name} collection to client.`);
	});

	Logger.log('Successfully added feedback module to client.');
};
