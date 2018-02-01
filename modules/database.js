const Logger = require('../util/Logger');
const sqlite = require('sqlite');

const PATH = process.env.DATABASE_PATH || './database.sqlite';
const PORT = process.env.DATABASE_PORT || 3000;

/**
 * Adds a database instance to the bot client.
 * 
 * For this module to function it must be called in `index.js` to mutate the
 * bot client before loading and running commands.
 * 
 * @param {*} client 
 */
module.exports = async (client) => {
	Logger.log('Establishing SQLite connection...');

	try {
		const connection = await sqlite.open(PATH, {
			cached: true
		});

		// TODO: Add database migrations to set up schema.

		client.database = connection;
		Logger.log('Successfully added database connection to client.');
	}
	catch (error) {
		Logger.error(error);
		throw new TypeError('Unable to establish database connection.');
	}
};
