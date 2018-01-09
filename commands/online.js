/**
 * Responds with the number of online users in the server, excluding bots.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message, args, level) => {
  const onlineUsers = message.guild.members
    .filter(member => member.presence.status === 'online' && !member.user.bot)
    .size;
  
  message.channel.send(`**Members Currently Online:** ${onlineUsers}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "online",
  category: "Miscellaneous",
  description: "Lists the number of online users in the server",
  usage: "online"
};
