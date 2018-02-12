/**
 * Responds with a link to Lysol's SoundCloud.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
  message.channel.send('Aero Soul: https://soundcloud.com/aerosoul');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "lysol",
  category: "Links",
  description: "Responds with a link to Lysol's SoundCloud.",
  usage: "lysol"
};
