/**
 * Clean up collab-bro
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 */
exports.run = async (client, message) => { 
    let tags = ['need', 'style', 'daw', 'reference'];
    let missing = [];
    let idiotValidation = true;

    for (let i = 0; i < tags.length; i++) {
	if (!message.content.toLowerCase().includes(tags[i])) {
	    missing.push(tags[i]);
	}
    }

    if (missing.length > 0) {
	message.author.send(` I'm sorry, but your message in #collab-bro must contain the following fields: "need", "style", "DAW", "reference" (or "references"). Quotes are not necessary.

You were missing: ${missing.join(', ')}

Please try like this:

Need: Female diva vocalist
Style: post-neo-trapstep
DAW: Disableton Studio Tools 10.5.3
References: http://soma.fm

(If you actually post that, a Staff member will visit you with a ban-stick in hand.)`);
    message.delete(0);
    }
};
    
exports.help = {
    name: "collab",
    channelID: "284393945151307776"
};
