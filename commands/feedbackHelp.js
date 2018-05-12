// Shows help for all feedback related commands.
// Shamelessly ripped off from help.js

exports.run = (client, message, args, level) => {
	if (!args[0]) {
		message.channel.send(commandsHelpOutput(client, message, level), { code: "asciidoc", split: { char: "\u200b" } });
	} else if (args[0] === "rules") {
		prefix = client.config.defaultSettings.prefix[0];
		// This should be added to help in some way. However I don't know how I want to do this yet.
		// I hate template literal multiline strings. Disgusting formatting.
		let output = "- Requesting feedback requires a point to spend.\n";
		output += "- Points are gained by giving feedback.\n\n";
		output += `- Use "${prefix}need" or "${prefix}recent" to see tracks that need feedback.\n`;
		output += `- Use "${prefix}feedback id", replacing id with the id number from the need or recent command, to give feedback.\n`;
		output += `- Use "${prefix}post link", replacing link with your link, to post your track.\n\n`;
		output += `- Type "${prefix}${help.name}" to see all the commands.\n`;
		output += "\n\nNO QUOTES in any of the commands.";
		message.channel.send(output, { code: "asciidoc", split: { char: "\u200b" } });
	}
};

const commandsHelpOutput = (client, message, level) => {
	if (message.channel.name !== "feedback-trade") {
		const feedbackChannel = message.guild.channels.find("name", "feedback-trade") || "#feedback-trade";

		message.channel.send(`\`${help.name}\` only works in ${feedbackChannel}.`);
		return;
	}
	const settings = message.guild ? client.settings.get(message.guild.id) : client.config.defaultSettings;

	const myCommands = message.guild
		? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level)
		: client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);

	const commandNames = myCommands.keyArray();
	const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

	let output = `== Feedback Help ==\n`;

	myCommands.forEach(x => {
		const cat = x.help.category.toProperCase();
		if (cat === "Feedback")
			output += `${settings.prefix[0]}${x.help.name}${" ".repeat(longest - x.help.name.length)} :: ${
				x.help.description
			}\n`;
	});

	return output;
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["fbHelp", "feedbackMoron", "fbRTFM", "helpFeedback"],
	permLevel: "User"
};

const help = {
	name: "feedbackHelp",
	category: "help",
	description: "Responds with a list of feedback related help commands",
	usage: "feedbackHelp"
};

exports.help = help;
