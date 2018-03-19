/**
 * A feedback point is used to track when a guild member gives useful feedback
 * to someone in the feedback channel.
 * 
 * FeedbackPoints are usable within an hour after they are created. Afterwards
 * an hour the point expires and cannot be redeemed for requesting feedback.
 * When dealing with FeedbackPoints in code, use this module for applying
 * changes to ensure immutability.
 */
const ONE_HOUR = 60 * 60 * 1000;

/*
export type FeedbackPoint = {
	userId: string,
	timestamp: number,
	used: boolean,
	message: string
};
*/

exports.timeToLive = ONE_HOUR;

exports.create = (userId, message) => {
	if (!userId || typeof userId !== 'string') {
		throw new TypeError('A FeedbackPoint requires a userId string');
	}

	if (!message || typeof message !== 'string') {
		throw new TypeError('A FeedbackPoint requires a message string');
	}

	const timestamp = Date.now();

	return {
		id: `${userId}.${timestamp}`,
		userId,
		timestamp,
		used: false,
		message
	};
};

exports.isExpired = point => point.used;

exports.expire = point => ({ ...point, used: true });
