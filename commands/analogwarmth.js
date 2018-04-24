/**
 * Responds with a link to the SOS article on what analog warmth is.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
  message.channel.send('<:warmth:419293308653797386> SoundOnSound article on \"What is analog warmth?\" - https://www.soundonsound.com/techniques/analogue-warmth');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "analogwarmth",
  category: "Miscellaneous",
  description: "What is analog warmth?",
  usage: "analogwarmth"
};