const Logger = require("../util/Logger");
const stringSimilarity = require("string-similarity");

const getRole = (guild, roleId) => {
	const role = guild.roles.get(roleId);

	if (!role) {
		const error = new TypeError(`Server is missing the ${role} role.`);
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

findRole = (settings, message, args) => {
	desiredRole = args.join("").trim();

	for (let p in settings.selfRoles) {
		let roleCheck = stringSimilarity.compareTwoStrings(p, desiredRole);

		// string-similarity returns a value indicating the match's likelihood. I tested and 0.25 seems to be the sweet spot.
		if (roleCheck > 0.25) {
			let bestMatch = stringSimilarity.findBestMatch(desiredRole, Object.keys(settings.selfRoles));
			let role = getRole(message.guild, settings.selfRoles[bestMatch.bestMatch.target]);

			return role;
		}
	}

	return null;
}

exports.run = async (client, message, args, level) => {
	const introChannelId = "intro";
	const settings = client.config;

	if (message.channel.name === introChannelId) {
		
		let	role = findRole(settings, message, args);

		if (role) {
			assignRole(message.member, role);

			message.channel.send(
				`Role ${role.name} found! Thank you for doing business. Enjoy the server.`
			);
		} else {
			message.channel.send(
				`Role "${args}" not found. Here are the possible options: ${Object.keys(settings.selfRoles).join(", ")}`
			);
		}
	} else {
		Logger.error(`Channel failure. Actual channel is ${message.channel.name}. Expected "intro".`);
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

