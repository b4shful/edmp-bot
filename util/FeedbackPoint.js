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

exports.timeToLive = ONE_HOUR;

exports.create = userId => {
	if (!userId || typeof userId !== 'string') {
		throw new TypeError('A FeedbackPoint requires a userId string');
	}

	const timestamp = Date.now();

	return {
		id: `${userId}.${timestamp}`,
		userId,
		timestamp,
		used: false
	};
};

exports.isExpired = point => point.used;

exports.expire = point => ({ ...point, used: true });
