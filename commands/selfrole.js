const Logger = require('../util/Logger');

const getRole = (guild, roleId) => {
  const role = guild.roles.get(roleId);

  if (!role) {
    const error = new TypeError('Server is missing the ${role} role.');
    Logger.error(error);
    throw error;
  }

  return role;
}

const assignRole = async (member, roleId) => {
  try {
    await member.addRole(roleiD);
  }
  catch (error) {
    Logger.error(error);

    throw new TypeError(`Unable to assign role ${roleId}`);
  }
};

exports.run = async (client, message, args, level) => {
    const introChannelId = '371004421586550784';
    const settings = client.config;
    let roleFound = false;
    let roleArray = [];
    
    if (message.channel.id === introChannelId) {
	desiredRole = args.join(' ');

	for (var p in settings.selfRoles) {
	    let roleCheck = settings.selfRoles[p].findIndex(x => x.toLowerCase() === desiredRole.toLowerCase());

	    // findIndex returns -1 on no match otherwise the index is returned which is >=0
	    if (if roleCheck > -1) {
		let role = getRole(message.guild, p);

		assignRole(message.member, role);
		
		message.channel.send(`Role ${desiredRole} found with id ${p}, thank you for doing business.`);
		roleFound = true;
	    }
	    
	    roleArray.concat(settings.selfRoles[p]);
	}
	if (roleFound === false) {
	    message.channel.send(`Role ${desiredRole} not found. Here are the possible options: ${roleArray.join(', ')}`);
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
