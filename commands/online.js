/**
 * Responds with the number online, idle, dnd, and offline users in the server
 * (excluding bots). Uses Discord Rich Embed.
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 * @returns {Discord.RichEmbed} A Discord custom embed object
 */

const Discord = require('discord.js');

const onlineEmoji = '<:online:407564377622052864>'
const offlineEmoji = '<:offline:407565080390008834>'
const idleEmoji = '<:idle:407565088598261760>'
const dndEmoji = '<:dnd:407565097246916609>'

exports.run = (client, message, args, level) => {
  const onlineUsers = message.guild.members
    .filter(member => member.presence.status === 'online' && !member.user.bot)
    .size;
  const awayUsers = message.guild.members
    .filter(member => member.presence.status === 'idle' && !member.user.bot)
    .size;
  const offlineUsers = message.guild.members
    .filter(member => member.presence.status === 'offline' && !member.user.bot)
    .size;
    const dndUsers = message.guild.members
    .filter(member => member.presence.status === 'dnd' && !member.user.bot)
    .size;
  
    const buildEmbed = new Discord.RichEmbed()
    .setTitle('Members')
    .setAuthor('EDMP Bot', client.user.avatarURL)
    .setColor(0x00ae86)
    .setDescription(`${onlineEmoji}Online Members: ${onlineUsers}\n\
${idleEmoji}Away Members: ${awayUsers}\n${offlineEmoji}Offline Members: ${offlineUsers}\n\
${dndEmoji}DND Members: ${dndUsers}`)
    .setFooter('This bot was made by your caring EDMP overlords');
    //.setThumbnail(COOKIE_IMAGE_URL);

  message.channel.send({embed: buildEmbed});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['members', 'offline', 'idle', 'dnd', 'users'],
  permLevel: "Mentor"
};

exports.help = {
  name: "online",
  category: "Miscellaneous",
  description: "Lists the number of online users in the server",
  usage: "online"
};
