const Logger = require('../util/Logger');
const Message = require('../util/Message');

const buildMessage = (member, rulesChannel) =>
  `Welcome to EDMP ${member}! Please make sure to tell one of the staff what DAW you use to make music by tagging \`@Staff\` in order to get access to other rooms! ${rulesChannel}`;

const getGuild = message => {
  const guild = Message.getGuild(message);

  if (!guild.available) {
    throw new TypeError('Server is currently unavailable.');
  }

  return guild;
};

const getMember = message => {
  const member = message.mentions.members.first();

  if (!member) {
    throw new TypeError('Gotta tell me who\'s the newbie.');
  }

  return member;
};

const getSettings = (client, guild) => {
  const {
    modLogChannel,
    welcomeChannel
  } = client.settings.get(guild.id);

  if (!modLogChannel) {
    throw new TypeError('`modLogChannel` is missing from bot configuration.');
  }

  if (!welcomeChannel) {
    throw new TypeError('`welcomeChannel` is missing from bot configuration.');
  }

  return { modLogChannel, welcomeChannel };
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
  const guild = getGuild(message);
  const member = getMember(message);

  const welcomeChannel = guild.channels.find('name', 'intro');
  const rulesChannel = guild.channels.find('name', 'rules_and_how-to');

  const welcomeMessage = buildMessage(member, rulesChannel);

  welcomeChannel.send(welcomeMessage).catch(Logger.error);
};

/**
 * Sends a welcome message.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
  try {
    parse(client, message);
  }
  catch (error) {
    Logger.error(`Something went wrong when parsing the command message:\n${error}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: "welcome",
  category: "Miscellaneous",
  description: "Displays a welcome message for a member.",
  usage: "welcome <member>"
};
