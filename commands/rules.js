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
		rulesList = "Server rules:\n";

		var ruleNumber = 1;

		for (let rule of rulesJson.rules) {
		    rulesList += rule + "\n";
		    ruleNumber++;
		}
		message.channel.send(rulesList);
	    } else if (parseInt(args[0])) {
		message.channel.send("Please use the rule command to specify a rule");
	    } else {
		message.channel.send("I'm sorry, Dave. I'm afraid I can't do that.");
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
    name: "rules",
    category: "Miscellaneous",
    description: "Responds with a list of all rules",
    usage: "rules"
};
