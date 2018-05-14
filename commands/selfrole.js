const Logger = require("../util/Logger");
const stringSimilarity = require("string-similarity");

const getRole = (guild, roleId) => {
	const role = guild.roles.get(roleId);

	if (!role) {
		const error = new TypeError("Server is missing the ${role} role.");
		Logger.error(error);
		throw error;
	}

	return role;
};

const assignRole = async (member, roleId) => {
	try {
		await member.addRole(roleId);
	} catch (error) {
		Logger.error(error);

		throw new TypeError(`Unable to assign role ${roleId}`);
	}
};

exports.run = async (client, message, args, level) => {
	const introChannelId = "intro";
	const settings = client.config;
	let roleFound = false;
	let roleArray = [];

	if (message.channel.name === introChannelId) {
		desiredRole = args.join("").trim();

		for (let p in settings.selfRoles) {
			let roleCheck = stringSimilarity.compareTwoStrings(p, desiredRole);

			// string-similarity returns a value indicating the match's likelihood. I tested and 0.25 seems to be the sweet spot.
			if (roleCheck > 0.25) {
				let bestMatch = stringSimilarity.findBestMatch(desiredRole, Object.keys(settings.selfRoles));
				let role = getRole(message.guild, settings.selfRoles[bestMatch.bestMatch.target]);

				assignRole(message.member, role);

				message.channel.send(`Role ${desiredRole} found! Thank you for doing business. Enjoy the server.`);
				roleFound = true;
			}
		}
		if (roleFound === false) {
			message.channel.send(
				`Role ${desiredRole} not found. Here are the possible options: ${Object.keys(settings.selfRoles).join(", ")}`
			);
		}
	}
};

exports.conf = {
	enabled: false,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "selfrole",
	category: "Miscellaneous",
	description: "Allows the user to set their role in the #intro room",
	usage: "selfrole"
};
