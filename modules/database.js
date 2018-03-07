const Logger = require('../util/Logger');
const path = require('path');
const fs = require('fs');
const sqlite = require('sqlite');

const PATH = process.env.BOT_DATABASE_PATH || './database.sqlite';
const PORT = process.env.BOT_DATABASE_PORT || 3000;

/**
 * Adds a database instance to the bot client.
 * 
 * For this module to function it must be called in `index.js` to mutate the
 * bot client before loading and running commands.
 * 
 * @param {*} client 
 */
module.exports = async client => {
	Logger.log('Establishing SQLite connection...');

	try {
		let database = await sqlite.open(PATH, {
			cached: true
		});

		const migrations = fs.readdirSync('migrations')
			.filter(file => path.extname(file) === '.sqlite');

		if (migrations.length > 0) {
			Logger.log('Applying database migrations');

			// NOTE: For the development environment, while working on the database
			// schema, you may want to set `force: 'last'` (default `false`) that
			// will force the migration API to rollback and re-apply the latest
			// migration over again each time when Node.js app launches.
			database = await database.migrate();
		}

		client.database = database;
		Logger.log('Successfully added database connection to client.');
	}
	catch (error) {
		Logger.error(error);
		throw new TypeError('Unable to establish database connection.');
	}
};
