const Message = require('../util/Message');

// TODO: Pass message object to get guild channels and roles.
const welcomeMessage = (member) =>
  `Welcome to EDMP ${member}! Please make sure to tell one of the staff what DAW you use to make music by tagging \`@Staff\` in order to get access to other rooms!`;

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

const getSettings = guild => {
  const {
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

  const { modLogChannel, welcomeChannel } = getSettings(guild);
  const message = welcomeMessage(member);

  guild.channels.find('name', modLogChannel)
    .send(`User ${member} joined EDMP.`)
    .catch(Logger.error);

  // Send the welcome message to the welcome channel
  // There's a place for more configs here.
  guild.channels.find('name', welcomeChannel)
    .send(message)
    .catch(Logger.error);
};

/**
 * Sends a welcome message.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) =>
  Message.respond(message, () => {
    checkSettings(message);
    return parse(client, message);
  });

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
