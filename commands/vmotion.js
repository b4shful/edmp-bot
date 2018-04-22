/**
 * Responds with a link to V:Motion's SoundCloud.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
  message.channel.send('V:Motion: https://soundcloud.com/vmotionmusic');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['v:motion'],
  permLevel: "User"
};

exports.help = {
  name: "vmotion",
  category: "Links",
  description: "Responds with a link to V:Motion's SoundCloud.",
  usage: "vmotion"
};
