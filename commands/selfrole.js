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

const findRole = (roleList, message, args) => {
    let desiredRole = args.join("").trim();

    if (!roleList) return null;

    for (let p in roleList) {
        let roleCheck = stringSimilarity.compareTwoStrings(p, desiredRole);

        // string-similarity returns a value indicating the match's likelihood. I tested and 0.25 seems to be the sweet spot.
        if (roleCheck > 0.25) {
            let bestMatch = stringSimilarity.findBestMatch(desiredRole, Object.keys(roleList));
            let role = getRole(message.guild, roleList[bestMatch.bestMatch.target]);

            return role;
        }
    }
    return null;
};

exports.run = async (client, message, args) => {
    const introChannelId = "intro";
    const settings = client.config;
    const isIntro = message.channel.name === introChannelId;
    let role = null;

    if (isIntro) role = findRole(settings.selfRoles, message, args);
    else role = findRole(settings.eventRoles, message, args);

    if (role) {
        assignRole(message.member, role);

        message.channel.send(
            `Role ${role.name} found! ${
                isIntro ? "Thank you for doing business. Enjoy the server." : `We'll notify you of further \`${role.name}\` related events.`
            }`
        );
    } else {
        message.channel.send(
            `Role "${args}" not found. Here are the possible options: ${Object.keys(
                isIntro ? settings.selfRoles : settings.eventRoles
            ).join(", ")}`
        );
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
    description: "Allows the user to set their role in the #intro room, or add event roles elsewhere",
    usage: "selfrole role-name"
};
