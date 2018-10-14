const chalk = require("chalk");
const moment = require("moment");

class DiscordLogger {
	static _log(content, type = 'log') {
		const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;

		switch (type) {
			case "log":
				console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
				break;

			case "warn":
				console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
				break;

			case "error":
				console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
				break;

			case "debug":
				console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
				break;

			case "cmd":
				console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
				break;

			case "ready":
				console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
				break;

			default:
				throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
		}
	}

	static log(...args) {
		this._log(...args);
	}

	static debug(...args) {
		this._log(...args, 'debug');
	}

	static warn(...args) {
		this._log(...args, 'warn');
	}

	static error(...args) {
		this._log(...args, 'error');
	}

	static cmd(...args) {
		this._log(...args, 'cmd');
	}
}

/**
 * Logs messages to the #logs-general text channel on the server
 *
 * Prefixes all messages with UTC timestamps and passes the message
 * to stdout for log files.
 *
 * @example
 * const ModLogger = require('./ModLogger');
 * ModLogger.log(guild, 'Log this message in a Discord text channel');
 */
class ModLogger extends DiscordLogger {
	/**
	 * @param {Guild} guild
	 * @param {any} content
	 */
	static log(guild, content) {
		super.log(content); // Still do stdout logging no matter what

		if (!guild || !guild.available) {
			return; // Can't log if the guild is missing...
		}

		const logChannel = guild.channels.find(({ type, name }) =>
			type === 'text' && name === 'logs-general'
		);

		if (!logChannel) {
			super.warn('Unable to find logging channel in server');
			return;
		}

		const timestamp = `\`[${moment().utc().format('YYYY-MM-DD HH:mm:ss z')}]:\``;
		logChannel.send(`${timestamp} ${content}`);
	}
}

module.exports = ModLogger;
