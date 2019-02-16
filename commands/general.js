// NOTE: Can be abstracted into a `shout` command that can use config to assign messages based on the channel
exports.run = (_client, message) => {
	if (message.author.bot || !message.member || message.channel.name !== "general-chat") {
		return;
	}

	message.channel.send("Stop mucking up #general-chat");
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Staff"
};

exports.help = {
	name: "general",
	category: "Miscellaneous",
	description: 'Tell people to calm down',
	usage: "general"
};
