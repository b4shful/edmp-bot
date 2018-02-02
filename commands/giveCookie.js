const Discord = require('discord.js');
const Logger = require('../util/Logger');
const Message = require('../util/Message');

const COOKIE_IMAGE_URL = 'https://cdn.discordapp.com/attachments/311541291869798400/333912198453788672/unknown.png';

/**
 * Returns a Discord.js RichEmbed to use as a response for a user earning
 * a cookie.
 * 
 * @param {Discord.GuildMember} member A member of the server
 * @returns {Discord.RichEmbed} A Discord custom embed object
 */
const buildEmbed = member => new Discord.RichEmbed()
  .setTitle('Golden Cookie')
  .setAuthor('EDMP Bot', member.user.avatarURL)
  .setColor(0x00ae86)
  .setDescription(`${member} has the golden cookie!`)
  .setFooter('This bot was made by your caring EDMP overlords')
  .setThumbnail(COOKIE_IMAGE_URL);

/**
 * @param {Discord.Guild} guild The Discord server
 * @param {Discord.Snowflake} roleId The id of the Cookie role
 * @returns {Discord.Role} The cookie role
 * @throws {TypeError} If the cookie role is missing from the guild
 */
const getCookieRole = (guild, roleId) => {
  const cookie = guild.roles.get(roleId);

  if (!cookie) {
    const error = new TypeError('Server is missing the Cookie role.');
    Logger.error(error);
    throw error;
  }

  return cookie;
}

/**
 * @param {Discord.Message} message
 * @returns {Discord.GuildMember} The first mentioned member in the server
 * @throws {TypeError} When no server member is mentioned
 */
const getMentionedMember = message => {
  const mentionedMembers = message.mentions.members;
  const error = new TypeError('No server members were mentioned.');

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
 * Removes the given cookie role from all members currently with it.
 * 
 * Discord rate limiting prevents doing more than two role actions at a time.
 * If there are more than two cookies assigned, then they need to be
 * removed manually.
 * 
 * @param {Discord.Role} cookie The cookie role
 * @throws {TypeError} When a role is unable to be removed
 */
const removePreviousCookie = async cookie => {
  const previousOwner = cookie.members.first();

  if (!previousOwner) { return; }

  try {
    await previousOwner.removeRole(cookie.id);
  }
  catch (error) {
    Logger.error(error);

    // Checking DiscordAPIErrors could be better.
    if (error.message === 'Missing Access') {
      throw new Error('Bot permissions are not high enough to modify server roles.');
    }

    throw new TypeError('Unable to remove previous cookies.');
  }
};

/**
 * Assigns the cookie role the given server member.
 * 
 * @param {Discord.Member} member Discord member to receive the cookie role
 * @param {Discord.Role} cookie The cookie role
 * @throws {TypeError} When adding a role fails
 */
const assignCookie = async (member, cookie) => {
  try {
    await member.addRole(cookie);
  }
  catch (error) {
    Logger.error(error);

    // Checking DiscordAPIErrors could be better.
    if (error.message === 'Missing Access') {
      throw new Error('Bot permissions are not high enough to modify server roles.');
    }

    throw new TypeError('Unable to assign cookie role.');
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
 * - If the cookie is assigned to a muted member
 * - If the cookie is assigned to the message author
 */
const parse = async (client, message) => {
  const cookieId = client.config.roleIds.cookie;
  const guild = Message.getGuild(message);
  const member = Message.getMember(message);

  if (!guild.available) {
    throw new TypeError('Server is currently unavailable.');
  }

  const cookie = getCookieRole(guild, cookieId);
  const mentionedMember = getMentionedMember(message);

  if (mentionedMember.mute) {
    throw new TypeError('Cookies are for good children.');
  }

  const isGivingCookieToSelf = message.author.id === mentionedMember.id;
  if (isGivingCookieToSelf) {
    throw new TypeError('Stop stealing from the cookie jar!');
  }

  const alreadyHasCookie = cookie.members.has(mentionedMember.id);
  if (alreadyHasCookie) {
    throw new TypeError('They already have a cookie.');
  }

  // There should only be one cookie!

  await removePreviousCookie(cookie);
  await assignCookie(mentionedMember, cookie);

  return { embed: buildEmbed(mentionedMember) };
};

/**
 * Assigns the member mentioned in the message the Cookie role.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 */
exports.run = async (client, message) => {
  return Message.respond(message, async () => {
    if (!client.config.roleIds.cookie) {
      Logger.error('Missing `roleIds.cookie: string` in config file.');
      throw new TypeError('The cookie is missing, please notify `@Staff`.');
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
  name: "giveCookie",
  category: "Miscellaneous",
  description: "Gives someone the golden cookie.",
  usage: "giveCookie <@member>"
};
