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
			message.channel.send(`${preface ? preface : ""}${txt}`);
		};

		client.logger.log(`Loading One Shot: ${p}`);
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
	name: "oneshot",
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
		text: "https://soundcloud.com/avulsion-music",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Avulsion's SoundCloud."
	},
	dankbutter: {
		preface: "Dank Butter - ",
		text: "https://soundcloud.com/dankestbutter",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Dank Butter's SoundCloud."
	},
	darkcat: {
		preface: "dark cat: ",
		text: "https://soundcloud.com/dark_cat",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to dark cat's SoundCloud."
	},
	dyce: {
		preface: "dyce. - ",
		text: "https://soundcloud.com/dyce-dot",
		aliases: ["dyce."],
		permLevel: "User",
		description: "Responds with a link to dyce.'s SoundCloud."
	},
	eden: {
		preface: "eden: ",
		text: "https://soundcloud.com/eden-sg",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to eden's SoundCloud."
	},
	edenc: {
		preface: "EdenC: ",
		text: "https://soundcloud.com/edenscoming",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to EdenC's SoundCloud."
	},
	frost: {
		preface: "frost: ",
		text: "https://soundcloud.com/frost",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to frost's SoundCloud."
	},
	glass: {
		preface: "```Nobody tells this to people who are beginners, I wish someone told me. All of us who do creative work, we get into it because we have good taste. But there is this gap. For the first couple years you make stuff, it’s just not that good. It’s trying to be good, it has potential, but it’s not. But your taste, the thing that got you into the game, is still killer. And your taste is why your work disappoints you. A lot of people never get past this phase, they quit. Most people I know who do interesting, creative work went through years of this. We know our work doesn’t have this special thing that we want it to have. We all go through this. And if you are just starting out or you are still in this phase, you gotta know its normal and the most important thing you can do is do a lot of work. Put yourself on a deadline so that every week you will finish one story. It is only by going through a volume of work that you will close that gap, and your work will be as good as your ambitions. And I took longer to figure out how to do this than anyone I’ve ever met. It’s gonna take awhile. It’s normal to take awhile. You’ve just gotta fight your way through.```",
		text: " - Ira Glass",
		aliases: [],
		permLevel: "User",
		description: "An inspiring quote by Ira Glass"
	},
	"ill-esha": {
		preface: "ill-ēsha: ",
		text: "https://soundcloud.com/ill-esha",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to ill-ēsha's SoundCloud."
	},
	iro: {
		preface: "Iro: ",
		text: "https://soundcloud.com/iromakesmusic",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Iro's SoundCloud."
	},
	ken: {
		preface: "Ken: ",
		text: "https://soundcloud.com/kerusira",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Ken's SoundCloud."
	},
	kindrid: {
		preface: "Kindrid:\n",
		text: "https://soundcloud.com/kindridmusic\n<https://twitter.com/KindridOfficial>",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Kindrid's SoundCloud."
	},
	lysol: {
		preface: "Aero Soul: ",
		text: "https://soundcloud.com/aerosoul",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Lysol's SoundCloud."
	},
	nathanielwyvern: {
		preface: "Nathaniel Wyvern: ",
		text: "https://soundcloud.com/nathanielwyvern",
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
		text: "https://soundcloud.com/sdktheway",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to SDKtheway's SoundCloud."
	},
	syrant: {
		preface: "Syrant: ",
		text: "https://soundcloud.com/syrantmusic",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Syrant's SoundCloud."
	},
	tainmere: {
		preface: "Tainmere's Production Resources: ",
		text: "http://bit.ly/2Ffgthb",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Tainmere's Music Resources."
	},
	ubida: {
		preface: "Ubida: ",
		text: "https://soundcloud.com/ubida",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Ubida's SoundCloud."
	},
	vmotion: {
		preface: "V:Motion: ",
		text: "https://soundcloud.com/vmotionmusic",
		aliases: ["v:motion"],
		permLevel: "User",
		description: "Responds with a link to V:Motion's SoundCloud."
	},
	xan: {
		preface: "Xan: ",
		text: "https://soundcloud.com/therealxan",
		aliases: [],
		permLevel: "User",
		description: "Responds with a link to Xan's SoundCloud."
	},
	xy: {
		preface:
			"It seems like you are asking about a solution, not about your problem. Read this page and learn how to learn better: ",
		text: "http://xyproblem.info",
		aliases: [],
		permLevel: "User",
		description: "XY question"
	}
};
