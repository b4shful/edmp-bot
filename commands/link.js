const Logger = require("../util/Logger");

exports.init = client => {
	for (p in links) {
		let newObj = {};
		newObj.help = {
			name: p,
			category: "Links",
			description: "tbd",
			usage: p
		};
		newObj.conf = module.exports.conf;

		// anti-closure brigade, engage!
		let curLink = links[p].link;
		let permLevel = links[p].permLevel;
		let aliases = links[p].aliases;
		let desc = links[p].description;

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

exports.cleanup = client => {};

exports.run = (client, message) => {
	message.channel.send(message);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "link",
	category: "Links",
	description: "Links module. For handling links to users and other snarky on-lines.",
	usage: "See other commands"
};

links = {
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
