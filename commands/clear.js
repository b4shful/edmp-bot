const Logger = require("../util/Logger");

exports.run = async (client, message, args, level) => {
    let { member, val } = getClearArgs(message, args);
    let logChannel;

    if (val < 1) {
        message.channel.send(
            `${message.member} You must supply a number of messages to delete that's greater than 0. \`${help.usage}\``
        );
        return;
    }

    if (!member && val < 1) {
        message.channel.send(
            `${
                message.member
            } What do you think I'm gonna do? You didn't supply a member or a number of messages. I'm not psychic! \`${
                help.usage
            }\``
        );
        return;
    }

    let modLog = Logger.getModLogger(message);

    const logDelete = deleted => {
        const { channel, cleanContent } = deleted;
        const { id, username, discriminator } = message.author;

        let logMessage = `${username}#${discriminator} deleted ${deleted.author.username}#${
            deleted.author.discriminator
        }'s message in **#${channel.name}**:\n${cleanContent} using clear`;
        Logger.log(logMessage);

        if (modLog) modLog.log(logMessage);
    };

    if (!member) {
        // This is just really fucking stupid. Fuck javascript.
        (async () => {
            await message.channel
                .fetchMessages({ limit: val })
                .then(messages => {
                    messages.forEach(msg => msg.delete().then(logDelete));
                })
                .catch(console.error);
        })();
        // Seriously dude. What The Fuck?


    } else if (member && val > 0) {

        // sigh

        (async () => {
            await message.channel
                .fetchMessages()
                .then(messages => messages.filter(m => m.author.id === member.id))
                .then(messages => {
                    messages.first(val).forEach(msg => msg.delete().then(logDelete));
                })
                .catch(console.error);
        })();

    } else {
        throw new TypeError("No member and no value supplied. Disastah!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Staff"
};

exports.help = {
    name: "clear",
    category: "Moderation",
    description: "Clears the last n messages from a user",
    usage: "mute <user> <number>"
};

getClearArgs = (message, args) => {
    const mentionedMembers = message.mentions.members;
    let retObj = { member: null, val: 0 };

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
};
