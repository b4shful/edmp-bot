/**
 * Response with rules, or the specific rule number.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = async (client, message, args, level) => { 
    var cLine = args.join(' ');

    var needRe = /need: (.*) style:/;
    var styleRe = /style: (.*) daw:/;
    var dawRe = /daw: (.*) ref:/;
    var refRe = /ref: (.*)$/;

    var need = needRe.exec(cLine)[1];
    var style = styleRe.exec(cLine)[1];
    var daw = dawRe.exec(cLine)[1];
    var ref = refRe.exec(cLine)[1];


    console.log("Need: " + need);
    console.log("Style: " + style);
    console.log("Daw: " + daw);
    console.log("Reference: " + ref);

    message.channel.send({embed: {
	color: 3447003,
	author: {
	    name: message.author.username,
	    icon_url: message.author.avatarURL},
	title: "I need a " + need + " to collab with!",
	description: "Looking since: " + new Date(),
	fields: [
	    {
		name: "Style",
		value: style
	    },
	    {
		name: "DAW",
		value: daw
	    },
	    {
		name: "Reference(s)",
		value: ref
	    }],
	footer: {
	    text: "Use this command with: :edmp: collab need: ___ style: ___ daw: ___ ref: ___"
	}
    }});
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "collab",
    category: "Miscellaneous",
    description: "Create a collaboration message",
    usage: "collab need: ___ style: ___ daw: ___ ref: ___"
};
