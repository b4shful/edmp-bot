const Sqlite = require('sqlite');

const validateClient = client => {
	if (!client.database) {
		throw new TypeError('Database is missing.');
	}
};

const confirmTables = database => {
	const expectedTables = [
		'FeedbackPoint',
		// 'FeedbackRequest'
	];

	expectedTables.forEach(async tableName => {
		const row = await database.get(
			"SELECT name FROM sqlite_master WHERE type='table' AND name=?;",
			tableName
		);

		if (!row) {
			throw new TypeError(`Database is missing required table for the feedback module: ${tableName}`);
		}
	});
};

module.exports = async client => {
	client.logger.log('Adding feedback module...');

	validateClient(client);
	confirmTables(client.database);

	client.logger.log('Successfully added feedback module to client.');
};
