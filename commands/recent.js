/**
 * 
 * @param {Discord.Client} client The Discord API client
 * @param {Discord.Message} message A message on Discord
 * @param {Array<string>} args An array of tokens used as command arguments
 * @param {number} level The permission level of the author of the message
 */
exports.run = (client, message) => {
  if (message.author.bot) return;

  if (message.channel.name !== 'feedback-trade') {
    const feedbackChannel =
      message.guild.channels.find('name', 'feedback-trade') || '#feedback-trade';

    message.channel.send(`\`recent\` only works in ${feedbackChannel}.`);
    return;
  };

  message.channel.send('**TODO:** Get the last 6 links from people asking for feedback');
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'recent',
  category: 'Feedback',
  description: '',
  usage: 'recent'
};
