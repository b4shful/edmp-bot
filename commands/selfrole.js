exports.run = async (client, message, args, level) => {
    const introChannelId = '371004421586550784';
    const settings = client.config;
    let roleFound = false;
    let roleList = '';
    
    if (message.channel.id === introChannelId) {
	desiredRole = args.join(' ');

	for (var p in settings.selfRoles) {
	    if (settings.selfRoles[p].findIndex(x => x.toLowerCase() === desiredRole.toLowerCase()) > -1) {
		message.channel.send(`Role ${desiredRole} found with id ${p}, thank you for doing business.`);
		let role = message.guild.roles.get(p);
		message.member.addRole(role);
		roleFound = true;
	    }
	    roleList += settings.selfRoles[p].join(', ') + ', ';
	}
	if (roleFound === false) {
	    message.channel.send(`Role ${desiredRole} not found. Here are the possible options: ${roleList.split(0, -2)}`);
	}
		
    }
};

exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "selfrole",
  category: "Miscellaneous",
  description: "Allows the user to set their role in the #intro room",
  usage: "selfrole"
};
