/**
 * Responds with a message declaring analog's greatness.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
  message.channel.send(':warmth: ***A N A L O G   W A R M T H*** :warmth:');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Ableton"
};

exports.help = {
  name: "analog",
  category: "Miscellaneous",
  description: "Responds with a message declaring analog's greatness.",
  usage: "analog"
};
