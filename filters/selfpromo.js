exports.run = async (client, message) => { 
    let tags = ['genre', 'description', 'link'];
    let missing = [];
    let idiotValidation = true;

    for (let i = 0; i < tags.length; i++) {
	if (!message.content.toLowerCase().includes(tags[i])) {
	    missing.push(tags[i]);
	}
    }

    if (missing.length > 0) {
	message.author.send(` I'm sorry, but your message in #self-promotion must contain the following fields: ${tags.join(", ")}. Quotes are not necessary.

You were missing: ${missing.join(', ')}

Please try like this:

Genre: Post-Neo Future-Trap-Bounce
Description: The hottest stuff to hit miami since Rudy Eugene
Link: <https://soundcloud.com/ill-esha/sets/into-the-sun-collab-w-nine>

(If you actually post that, a Staff member will visit you with a ban-stick in hand.)`);
    message.delete(0);
    }
};


// Filters can have channelIDs as a single string or an array of strings.
// This applies the filter to all IDs listed.
exports.help = {
    name: "self-promotion",
    channelID: ["253605007352397824"]
};
