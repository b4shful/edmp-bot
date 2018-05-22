const Logger = require("../util/Logger");

exports.init = client => {
	for (p in oneShots) {
		// Creating an ad-hoc "module" to pass along for command parsing in event/message.js
		let newObj = {};
		newObj.help = {
			name: p,
			category: "One Shots",
			description: "tbd",
			usage: p
		};
		newObj.conf = module.exports.conf;

		// anti-closure brigade, engage!
		let curLink = oneShots[p].link;
		let permLevel = oneShots[p].permLevel;
		let aliases = oneShots[p].aliases;
		let desc = oneShots[p].description;

		newObj.help.description = desc;
		newObj.help.usage = p;
		newObj.conf.aliases = aliases;
		newObj.conf.permLevel = permLevel;

		newObj.run = (client, message) => {
			message.channel.send(curLink);
		};

		client.logger.log(`Loading Link: ${p}`);
		client.commands.set(p, newObj);
	}
};

// We must remove all one shots from the commands list when links is unloaded/shutdown.
exports.shutdown = async client => {
	for (p in oneShots) {
		if (client.commands.has(p)) {
			command = client.commands.get(p);
		} else if (client.aliases.has(p)) {
			command = client.commands.get(client.aliases.get(p));
		}

		if (!command) {
			Logger.log(
				`Failure in Oneshot Unloading. The command \`${p}\` doesn't seem to exist, nor is it an alias. Try again!`
			);
			return;
		}
		Logger.log(`Unloading One Shot: ${p}`);
		client.commands.delete(p);
	}
};

exports.run = (client, message) => {
	message.channel.send(message);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Administrator"
};

exports.help = {
	name: "link",
	category: "One Shots",
	description: "Links module. For handling links to users and other snarky one-lines.",
	usage: "See other commands"
};

oneShots = {
	soundcloud: {
		link: "https://soundcloud.com/stream",
		aliases: [],
		permLevel: "User",
		description: "Soundcloud Link"
	},
	presonus: {
		link: "https://www.presonus.com",
		aliases: [],
		permLevel: "User",
		description: "Presonus Link"
	}
};
