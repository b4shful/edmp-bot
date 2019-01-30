/**
 * Response with rules, or the specific rule number.
 *
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = async (client, message, args, level) => {
	const http = require("https");
	var url = "https://edmpdiscord.com/rules.json";

	http.get(url, res => {
		res.setEncoding("utf8");
		let body = "";
		res.on("data", data => {
			body += data;
		});
		res.on("end", () => {
			var rulesJson = JSON.parse(body);

			if (!args[0]) {
				message.channel.send("Please specify a rule");
			} else if (isNaN(parseInt(args[0]))) {
				message.channel.send("Please specific an actual number, thanks.");
			} else if (parseInt(args[0]) <= rulesJson.rules.length) {
				message.channel.send(rulesJson.rules[parseInt(args[0]) - 1]);
			} else if (args[0] === "34") {
				message.channel.send("If it exists, there is porn of it – no exceptions");
			}
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "rule",
	category: "Miscellaneous",
	description: "Responds with a specific rule",
	usage: "rule #"
};
