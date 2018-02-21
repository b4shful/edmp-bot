exports.run = async (client, message, args, level) => {
  if (!args || args.length < 1) return message.reply("Must provide a filter to reload");

  let response = await client.unloadfilter(args[0]);
  if (response) return message.reply(`Error Unloading: ${response}`);

  response = client.loadFilter(args[0]);
  if (response) return message.reply(`Error Loading: ${response}`);

  message.reply(`The filter \`${args[0]}\` has been reloaded`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: "reloadFilter",
  category: "System",
  description: "Reloads a filter that\"s been modified.",
  usage: "reloadFilter [command]"
};
