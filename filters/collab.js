/**
 * Clean up collab-bro
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 */
exports.run = async (client, message) => { 
    var tags = ['need', 'style', 'DAW', 'reference'];
    var missing = [];
    var idiotValidation = true;

    for (var i = 0; i < tags.length; i++) {
	if (!message.content.toLowerCase().includes(tags[i])) {
	    missing.push(tags[i]);
	}
    }

    if (missing.length > 1) {
	message.author.send(` I'm sorry, but your message in #collab-bro must contain the following fields: "need", "style", "DAW", "reference" (or "references"). Quotes are not necessary.

You were missing: ${missing.join(', ')}

Please try again!`);
    message.delete(0);
    }
};
    
exports.help = {
    name: "collab",
    channelID: "284393945151307776"
};
