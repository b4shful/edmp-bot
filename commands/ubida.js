/**
 * Responds with a link to Ubida's SoundCloud.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
  message.channel.send('Ubida: https://soundcloud.com/ubida');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "ubida",
  category: "Links",
  description: "Responds with a link to Ubida's SoundCloud.",
  usage: "ubida"
};