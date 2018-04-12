const Message = require('../util/Message');

/**
 * @param {Discord.Message} message
 * @returns {Discord.GuildMember} The first mentioned member in the server
 * @throws {TypeError} When no server member is mentioned
 */
const getMentionedMembers = message => {
  const mentionedMembers = message.mentions.members;

  if (!mentionedMembers) {
    throw new TypeError('No server members were mentioned.');
  }

  return mentionedMembers;
};

/**
 * Parses message for appropriate response.
 * 
 * @param {Discord.Client} client The bot client
 * @param {Discord.Message} message A Discord message
 * 
 * @throws {TypeError}
 * - If the server is unavailable in the Discord API
 * - If no members are mentioned in the message
 */
const parse = (client, message) => {
  const guild = Message.getGuild(message);

  if (!guild.available) {
    throw new TypeError('Server is currently unavailable.');
  }

  const slapper = message.member.displayName;
  const mentions = message.mentions.members;

  if (!mentions.first()) {
    throw new TypeError('Gotta mention who\'s getting slapped.');
  }

  const slappees = mentions.map(member => member.displayName)
    .reduce((str, name, i, array) => {
      if (i === 0) {
        return `${name}`;
      }
      else if (i === array.length - 1 && array.length === 2) {
        return `${str} and ${name}`;
      }
      else if (i === array.length - 1) {
        return `${str}, and ${name}`;
      }
      return `${str}, ${name}`;
    }, '');

  return `*${slapper} slapped ${slappees} with a large trout.*`;
};

/**
 * Say shit, get hit.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) =>
  Message.respond(message, () => parse(client, message));

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['trout'],
  permLevel: 'Administrator'
};

exports.help = {
  name: 'slap',
  category: 'Miscellaneous',
  description: 'Say shit, get hit.',
  usage: 'slap <user>'
};
