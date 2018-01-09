/**
 * @param {Discord.Message} message
 * @returns {Discord.GuildMember} A member of the server
 * @throws {TypeError} If the message author isn't currently a member of the server 
 */
exports.getMember = message => {
  const { member } = message;

  if (!member) {
    throw new TypeError('Message is not from a member of the server.');
  }

  return member;
}

/**
 * @param {Discord.Message} message A Discord message
 * @returns {Discord.Guild} The Discord server
 * @throws {TypeError} If the guild is not included in the message
 */
exports.getGuild = message => {
  const { guild } = message;

  if (!guild) {
    throw new TypeError('This command is only available in the server.');
  }

  return guild;
};