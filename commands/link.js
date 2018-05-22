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
		let txt = oneShots[p].text;
		let permLevel = oneShots[p].permLevel;
		let aliases = oneShots[p].aliases;
		let desc = oneShots[p].description;
		let preface = oneShots[p].preface;

		newObj.help.description = desc;
		newObj.help.usage = p;
		newObj.conf.aliases = aliases;
		newObj.conf.permLevel = permLevel;

		newObj.run = (client, message) => {
			message.channel.send(preface + txt);
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
	bee: {
		preface: "AdmiralBumbleBee Blog: ",
		text: "http://admiralbumblebee.com/edmp",
		aliases: ["dad"],
		permLevel: "User",
		description: "Responds with a link to AdmiralBumbleBee's blog."
	},
	admit: {
		preface: "",
		text: "https://soundcloud.com/admt",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to admit's SoundCloud."
	},
	analogwarmth: {
		text:
			'<:warmth:419293308653797386> SoundOnSound article on "What is analog warmth?" - https://www.soundonsound.com/techniques/analogue-warmth',
		aliases: [],
		permLevel: "User",
		description: "What is analog warmth?"
	},
	ask: {
		preface: "",
		text: "Don't ask to ask a question, ***ask*** the question!",
		aliases: [],
		permission: "User",
		description: "What to do when you have a question on the internet."
	},
	avulsion: {
		preface: "Avulsion: ",
		link: "https://soundcloud.com/avulsion-music",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Avulsion's SoundCloud."
	},
	dankbutter: {
		preface: "Dank Butter - ",
		link: "https://soundcloud.com/dankestbutter",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Dank Butter's SoundCloud."
	},
	darkcat: {
		preface: "dark cat: ",
		link: "https://soundcloud.com/dark_cat",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to dark cat's SoundCloud."
	},
	dyce: {
		preface: "dyce. - ",
		link: "hl,https://soundcloud.com/dyce-dot",
		aliases: ["dyce."],
		permLevel: "User",
		description: "Responds with a link to dyce.'s SoundCloud."
	},
	eden: {
		preface: "eden: ",
		link: "hl,https://soundcloud.com/eden-sg",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to eden's SoundCloud."
	},
	edenc: {
		preface: "EdenC: ",
		link: "hl,https://soundcloud.com/edenscoming",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to EdenC's SoundCloud."
	},
	frost: {
		preface: "frost: ",
		link: "hl,https://soundcloud.com/frost",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to frost's SoundCloud."
	},
	"ill-esha": {
		preface: "ill-ēsha: ",
		link: "hl,https://soundcloud.com/ill-esha",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to ill-ēsha's SoundCloud."
	},
	iro: {
		preface: "Iro: ",
		link: "hl,https://soundcloud.com/iromakesmusic",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Iro's SoundCloud."
	},
	ken: {
		preface: "Ken: ",
		link: "hl,https://soundcloud.com/kerusira",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Ken's SoundCloud."
	},
	kindrid: {
		preface: "Kindrid:\n",
		link: "hl,https://soundcloud.com/kindridmusic\n<https://twitter.com/KindridOfficial>",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Kindrid's SoundCloud."
	},
	lysol: {
		preface: "Aero Soul: ",
		link: "hl,https://soundcloud.com/aerosoul",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Lysol's SoundCloud."
	},
	nathanielwyvern: {
		preface: "Nathaniel Wyvern: ",
		link: "hl,https://soundcloud.com/nathanielwyvern",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Nathaniel Wyvern's SoundCloud."
	},
	rtfm: {
		text: "*Read the fuckin' manual*",
		aliases: [],
		permLevel: "Mentor",
		description: "Read the fuckin' manual."
	},
	sdktheway: {
		preface: "SDKtheway: ",
		link: "hl,https://soundcloud.com/sdktheway",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to SDKtheway's SoundCloud."
	},
	syrant: {
		preface: "Syrant: ",
		link: "hl,https://soundcloud.com/syrantmusic",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Syrant's SoundCloud."
	},
	tainmere: {
		preface: "Tainmere's Production Resources: ",
		link: "hl,http://bit.ly/2Ffgthb",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Tainmere's Music Resources."
	},
	ubida: {
		preface: "Ubida: ",
		link: "hl,https://soundcloud.com/ubida",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Ubida's SoundCloud."
	},
	vmotion: {
		preface: "V:Motion: ",
		link: "hl,https://soundcloud.com/vmotionmusic",
		aliases: ["v:motion"],
		permLevel: "User",
		description: "Responds with a link to V:Motion's SoundCloud."
	},
	xan: {
		preface: "Xan: ",
		link: "hl,https://soundcloud.com/therealxan",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Xan's SoundCloud."
	},
	xy: {
		preface:
			"It seems like you are asking about a solution, not about your problem. Read this page and learn how to learn better: ",
		link: "http://xyproblem.info",
		aliases: [],
		permLevel: "User",
		description: "XY question"
	}
};
