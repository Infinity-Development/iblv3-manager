const config = require('../../Settings/Config');

module.exports = async (oldMember, newMember) => {
  if (
    !newMember ||
    newMember.user.bot ||
    !newMember.member.presence.activities[0]
  )
    return;
  if (newMember.member.presence.activities[0].state) {
    newMember.member.presence.activities[0].state.match(
      /(infinitybots|ibl.gg\/infinity|infinitybots.gg|botlist.site|ibl.rocks)/gi,
    )
      ? newMember.member.roles
          .add(newMember.guild.roles.cache.get('771037723422228501'))
          .catch(() => {})
      : newMember.member.roles
          .remove(newMember.guild.roles.cache.get('771037723422228501'))
          .catch(() => {});
  }
};
