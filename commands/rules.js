/**
 * Response with rules, or the specific rule number.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = async (client, message, args, level) => { 
    
    const http = require("http");
    var url = "http://edmpdiscord.com/rules.json";

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
	} else if (parseInt(args[0]) < rulesJson.rules.length) {
	    message.channel.send(rulesJson.rules[parseInt(args[0]) - 1]);
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
  category: "Moderation",
  description: "Responds with a list of all rules, or the specific numbered rule.",
  usage: "rules, or rules #"
};
