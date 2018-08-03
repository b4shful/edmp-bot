const Logger = require('../../util/Logger');
const MemberBackup = require('./MemberBackup');

// Restore occcur on:
// - GuildMemberAdd
// - Manual restore

// Backup updates occur on:
// - GuildMemberRemove

exports.restoreUser = async (database, member) => {
  let backup;
  try {
    backup = MemberBackup.get(database, member);
  }
  catch (error) {
    Logger.error(error.message);
    return;
  } 

  if (!backup) {
    return; // No backup found, must be a brand new member
  }

  const parsedBackup = MemberBackup.deserializeMember(backup);

  const { user: { id, username, discriminator } } = member;
  Logger.debug(`${username}#${discriminator} (${id}) has guild member backup:\n${parsedBackup}`);

  const { userId, nickname, roles, muted, deaf } = parsedBackup;

  if (roles) {
    Logger.debug(`${username}#${discriminator} (${id}) has backed-up roles: ${roles}`);
    await member.setRoles(roles);
    Logger.debug(`${username}#${discriminator} (${id}) has restored roles: ${roles}`);
  }

  // Bots may not have permission to set nicknames by default
  if (nickname) {
    Logger.debug(`${username}#${discriminator} (${id}) has backed-up nickname: ${nickname}`);
    await member.setNickname(nickname);
    Logger.debug(`${username}#${discriminator} (${id}) has restored nickname: ${nickname}`);
  }

  if (muted || deaf) {
    Logger.debug(`${username}#${discriminator} (${id}) has backed-up voice settings: { muted: ${muted}, deaf: ${deaf} }`);
    await member.setMute(muted);
    await member.setDeaf(deaf);
    Logger.debug(`${username}#${discriminator} (${id}) has restored voice settings: { muted: ${muted}, deaf: ${deaf} }`);
  }

  Logger.log(`${username}#${discriminator} (${userId}) was restored`)
};

exports.onGuildMemberAdd = async (database, member) =>
  exports.restoreUser(database, member);

exports.onGuildMemberRemove = (database, member) => {
  let backup;
  try {
    backup = MemberBackup.get(database, member);
  }
  catch (error) {
    Logger.error(error.message);
    return;
  }

  const { user: { id, username, discriminator } } = member;

  if (!backup) {
    MemberBackup.create(database, member);
    Logger.log(`${username}#${discriminator} (${id}) backup was created`)
  }
  else {
    MemberBackup.update(database, member);
    Logger.log(`${username}#${discriminator} (${id}) backup was updated`)
  }
};
