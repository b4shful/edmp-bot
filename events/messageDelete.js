module.exports = (_client, message) => {
	const { author, guild } = message;
	if (author.bot || !guild || !guild.available) return;

	const logChannel = guild.channels.find(({ type, name }) =>
		type === 'text' && name === 'logs-general'
	);

	if (!logChannel) return;

	const { channel, cleanContent } = message;
	const { id, username, discriminator } = author;
	const logMessage = `${username}#${discriminator} (\`${id}\`) message deleted in **#${channel.name}**:\n${cleanContent}`;
	console.log(logMessage);
	logChannel.send(logMessage);
};
