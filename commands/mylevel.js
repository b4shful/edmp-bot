exports.run = async (client, message, args, level) => {
	const friendly = client.config.permLevels.find(l => l.level === level).name;
	message.reply(`Your permission level is: ${level} - ${friendly}`);
};

exports.conf = {
	enabled: false,
	guildOnly: true,
	aliases: [],
	permLevel: "Mentor"
};

exports.help = {
	name: "mylevel",
	category: "Miscellaneous",
	description: "Tells you your permission level for the current message location.",
	usage: "mylevel"
};
