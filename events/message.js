// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = (client, message) => {
	// It's good practice to ignore other bots. This also makes your bot ignore itself
	// and not get into a spam loop (we call that "botception").
	if (message.author.bot) return;

	// Grab the settings for this server from the PersistentCollection
	// If there is no guild, get default conf (DMs)
	const settings = message.guild ? client.settings.get(message.guild.id) : client.config.defaultSettings;

	const filterMap = client.filters;

	// For ease of use in commands and functions, we'll attach the settings
	// to the message object, so `message.settings` is accessible.
	message.settings = settings;

	// Also good practice to ignore any message that does not start with our prefix,
	// which is set in the configuration file.

	let prefixMatch = client.matchFirstString(message.content, settings.prefix);

	// Run the filter if it exists and matches the channelName
	// client.filters is an enmap, if the filter has an array of channelName then each name is its own property
	// the key is the filter object.
	// We can allow commands based on allowCategory or allowCommands, so certain commands can be used despite the filter
	if (filterMap) {
		if (filterMap.has(message.channel.name)) {
			let rFilter = filterMap.get(message.channel.name);
			if (prefixMatch === false) {
				rFilter.run(client, message);
				return;
			}

			const command = message.content
				.slice(settings.prefix[prefixMatch].length)
				.trim()
				.split(/ +/g)
				.shift()
				.toLowerCase();
			const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
			let catMatch = false;
			let comMatch = false;

			if (!cmd) return;

			if (rFilter.help.allowCategory) {
				if (rFilter.help.allowCategory.toLowerCase() === "all") {
					catMatch = true;
				}
				if (cmd.help.category.toLowerCase() !== rFilter.allowCategory) {
					catMatch = true;
				}
			}

			if (rFilter.help.allowCommands) {
				for (let i = 0; i < rFilter.help.allowCommands.length; i++) {
					if (rFilter.help.allowCommands[i].toLowerCase() === cmd.help.name.toLowerCase()) {
						comMatch = true;
						break;
					}
				}
			}

			if (!catMatch && !comMatch) {
				rFilter.run(client, message);
				return;
			}
		}
	}

	if (prefixMatch === false) return;

	// Here we separate our "command" name, and our "arguments" for the command.
	// e.g. if we have the message "+say Is this the real life?" , we'll get the following:
	// command = say
	// args = ["Is", "this", "the", "real", "life?"]
	const args = message.content
		.slice(settings.prefix[prefixMatch].length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();

	// Get the user or member's permission level from the elevation
	const level = client.permlevel(message);

	// Check whether the command, or alias, exist in the collections defined
	// in app.js.
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
	// using this const varName = thing OR otherthign; is a pretty efficient
	// and clean way to grab one of 2 values!
	if (!cmd) return;

	// Some commands may not be useable in DMs. This check prevents those commands from running
	// and return a friendly error message.
	if (cmd && !message.guild && cmd.conf.guildOnly)
		return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

	if (level < client.levelCache[cmd.conf.permLevel]) {
		if (settings.systemNotice === "true") {
			return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
		} else {
			return;
		}
	}

	// To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
	// The "level" command module argument will be deprecated in the future.
	message.author.permLevel = level;

	message.flags = [];
	while (args[0] && args[0][0] === "-") {
		message.flags.push(args.shift().slice(1));
	}
	// If the command exists, **AND** the user has permission, run it.
	client.logger.cmd(
		`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${
			message.author.id
		}) ran command ${cmd.help.name}`
	);
	cmd.run(client, message, args, level);

	// After all is said and done... delete everything in collab-bro.
	//if (message.channel.id === '414450318601093120') {
	//  message.delete(0);
	//}
};
