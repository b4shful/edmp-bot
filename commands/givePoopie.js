const Discord = require("discord.js");
const Logger = require("../util/Logger");
const Message = require("../util/Message");

const POOPIE_IMAGE_URL = "https://cdn.discordapp.com/attachments/309056894587240450/459892980854161440/unknown.png";

/**
 * Returns a Discord.js RichEmbed to use as a response for a user earning
 * a poopie.
 *
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.GuildMember} member A member of the server
 * @returns {Discord.RichEmbed} A Discord custom embed object
 */
const buildEmbed = (client, member) =>
	new Discord.RichEmbed()
		.setTitle("Brown Poopie")
		.setAuthor("EDMP Bot", client.user.avatarURL)
		.setColor(0xd2691e)
		.setDescription(`${member} has the brown poopie!`)
		.setFooter("This bot was made by your caring EDMP shitlords.")
		.setThumbnail(POOPIE_IMAGE_URL);

/**
 * @param {Discord.Guild} guild The Discord server
 * @param {Discord.Snowflake} roleId The id of the Poopie role
 * @returns {Discord.Role} The poopie role
 * @throws {TypeError} If the poopie role is missing from the guild
 */
const getPoopieRole = (guild, roleId) => {
	const poopie = guild.roles.get(roleId);

	if (!poopie) {
		const error = new TypeError("Server is missing the Poopie role.");
		Logger.error(error);
		throw error;
	}

	return poopie;
};

/**
 * @param {Discord.Message} message
 * @returns {Discord.GuildMember} The first mentioned member in the server
 * @throws {TypeError} When no server member is mentioned
 */
const getMentionedMember = message => {
	const mentionedMembers = message.mentions.members;
	const error = new TypeError("No server members were mentioned.");

	if (!mentionedMembers) {
		throw error;
	}

	const firstMentionedMember = mentionedMembers.first();

	if (!firstMentionedMember) {
		throw error;
	}

	return firstMentionedMember;
};

/**
 * Removes the given poopie role from all members currently with it.
 *
 * Discord rate limiting prevents doing more than two role actions at a time.
 * If there are more than two poopies assigned, then they need to be
 * removed manually.
 *
 * @param {Discord.Role} poopie The poopie role
 * @throws {TypeError} When a role is unable to be removed
 */
const removePreviousPoopie = async poopie => {
	const previousOwner = poopie.members.first();

	if (!previousOwner) {
		return;
	}

	try {
		await previousOwner.removeRole(poopie.id);
	} catch (error) {
		Logger.error(error);

		// Checking DiscordAPIErrors could be better.
		if (error.message === "Missing Access") {
			throw new Error("Bot permissions are not high enough to modify server roles.");
		}

		throw new TypeError("Unable to remove previous poopies.");
	}
};

/**
 * Assigns the poopie role the given server member.
 *
 * @param {Discord.Member} member Discord member to receive the poopie role
 * @param {Discord.Role} poopie The poopie role
 * @throws {TypeError} When adding a role fails
 */
const assignPoopie = async (member, poopie) => {
	try {
		await member.addRole(poopie);
	} catch (error) {
		Logger.error(error);

		// Checking DiscordAPIErrors could be better.
		if (error.message === "Missing Access") {
			throw new Error("Bot permissions are not high enough to modify server roles.");
		}

		throw new TypeError("Unable to assign poopie role.");
	}
};

/**
 * Parses message for appropriate response.
 *
 * @param {Discord.Client} client The bot client
 * @param {Discord.Message} message A Discord message
 * @returns {Object} A response with an embed
 *
 * @throws {TypeError}
 * - If the server is unavailable in the Discord API
 * - If the poopie is assigned to a muted member
 * - If the poopie is assigned to the message author
 */
const parse = async (client, message) => {
	const poopieId = client.config.roleIds.poopie;
	const guild = Message.getGuild(message);
	const member = Message.getMember(message);

	if (!guild.available) {
		throw new TypeError("Server is currently unavailable.");
	}

	const poopie = getPoopieRole(guild, poopieId);
	const mentionedMember = getMentionedMember(message);

	//This is checking for Voice mute. Replace with role mute if desired.
	//if (mentionedMember.mute) {
	//	throw new TypeError("Poopies are for good children.");
	//}

	const isGivingPoopieToSelf = message.author.id === mentionedMember.id;
	if (isGivingPoopieToSelf) {
		throw new TypeError("Stop stealing from the poopie jar!");
	}

	const alreadyHasPoopie = poopie.members.has(mentionedMember.id);
	if (alreadyHasPoopie) {
		throw new TypeError("They already have a poopie.");
	}

	// There should only be one poopie!

	await removePreviousPoopie(poopie);
	await assignPoopie(mentionedMember, poopie);

	return { embed: buildEmbed(client, mentionedMember) };
};

/**
 * Assigns the member mentioned in the message the Poopie role.
 *
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 */
exports.run = async (client, message) => {
	return Message.respond(message, async () => {
		if (!client.config.roleIds.poopie) {
			Logger.error("Missing `roleIds.poopie: string` in config file.");
			throw new TypeError("The poopie is missing, please notify `@Staff`.");
		}

		return parse(client, message);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Mentor"
};

exports.help = {
	name: "givePoopie",
	category: "Miscellaneous",
	description: "Gives someone the brown poopie.",
	usage: "givePoopie <@member>"
};
