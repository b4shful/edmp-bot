const Message = require('../util/Message');

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

  const slapper = message.author.username;
  const mentions = message.mentions.members;

  if (!mentions.first()) {
    throw new TypeError('Gotta mention who\'s getting slapped.');
  }

  const slappees = mentions.map(member => member.user.username)
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
  message.reply('*Read the fuckin\' manual*');

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Mentor'
};

exports.help = {
  name: 'rtfm',
  category: 'Miscellaneous',
  description: 'Read the fuckin\' manual.',
  usage: 'rtfm'
};
