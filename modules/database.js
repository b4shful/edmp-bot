const Database = require('better-sqlite3');
const DATABASE_PATH = process.env.BOT_DATABASE_PATH || './database.sqlite';

/**
 * Adds a database instance to the bot client.
 * 
 * For this module to function it must be called in `index.js` to mutate the
 * bot client before loading and running commands.
 * 
 * @param {*} client 
 */
module.exports = client => {
	client.logger.log('Establishing SQLite connection...');
	try {
		let database = new Database(DATABASE_PATH);
		client.database = database;
		client.logger.log('Successfully added database connection to client.');
	}
	catch (error) {
		client.logger.error(error);
		throw new TypeError('Unable to establish database connection.');
	}
};
