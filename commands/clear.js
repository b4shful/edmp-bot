const Logger = require('../util/Logger');

exports.run = async (client, message, args, level) => {
    let {member, val} = getClearArgs(message, args);

	if (val < 1) {
        message.channel.send(`${message.member} You must supply a number of messages to delete that's greater than 0. \`${
			help.usage
		}\``);
    }
    
    if (!member && val < 1) {
		message.channel.send(`${message.member} What do you think I'm gonna do? You didn't supply a member or a number of messages. I'm not psychic! \`${
			help.usage
		}\``);
	}

    if (!member) {
        message.channel.bulkDelete(val);
        Logger.log(`${message.author.username}#${message.author.discriminator} deleted the last ${val} messages in ${message.channel.name} using clear`)
    } else if (member && val > 0) {
        fetched = await message.channel.fetchMessages()
            .then(messages => messages.filter(m => m.author.id === member.id))
            .catch(console.error);
            message.channel.bulkDelete(fetched);
            Logger.log(`${message.author.username} deleted the last ${val} messages from ${member.username}#${message.author.discriminator} in ${message.channel.name} using clear`)
            
            // Delete the message triggering the clear. Debatable?
            message.delete()
                .then(msg => console.log(`Deleted message from ${msg.author.username}`))
                .catch(console.error);
    } else {
        throw new TypeError("No member and no value supplied. Disastah!");
    }
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'Staff'
};

exports.help = {
	name: 'clear',
	category: 'Moderation',
	description: 'Clears the last n messages from a user',
	usage: 'mute <user> <number>'
};

getClearArgs = (message, args) => {
    const mentionedMembers = message.mentions.members;
    let retObj = {member: null, val: 0};

    const firstMentionedMember = mentionedMembers.first();

    if (!firstMentionedMember) {
        retObj.val = parseInt(args[0]);
        // return with failed val parse or the val. Calling function should err on val of 0
        return retObj;
    } else {
        retObj.val = parseInt(args[1]);
        retObj.member = firstMentionedMember;
        return retObj;
    }
}