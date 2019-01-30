const Discord = require("discord.js");

exports.run = async (client, message) => {
	if (message.content.includes("why") && message.content.includes("nsfw")) {
		const embed = new Discord.RichEmbed()
			.setTitle("Time to explain shit that's in the pins...")
			.setAuthor("EDMP Bot", client.user.avatarURL)
			.setColor(0x00ae86)
			.setDescription(
				"People in this channel are usually at work while chatting in this channel when they shouldn't be. That's bad. Don't use discord at work, it's not safe for work. This channel is not safe for work."
			)
			.setFooter("Are you happy? Now fuck off. Thanks.");
		message.channel.send({ embed });
	}
};

// Filters can have channelIDs as a single string or an array of strings.
// This applies the filter to all IDs listed.
exports.help = {
	name: "nsfw",
	channelNames: ["software-development"]
};
