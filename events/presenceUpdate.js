const { ActivityType } = require('discord.js');
const ownerstatus = require('../commands/utility/ownerstatus');

module.exports = {
    name: 'presenceUpdate',
    execute: async (oldPresence, newPresence) => {
        await ownerstatus.handlePresenceUpdate(oldPresence, newPresence);

        const client = newPresence.client;
        const guild = newPresence.guild;
        const member = guild.members.cache.get(newPresence.userId);
        const customStatus = newPresence.activities.find(activity => activity.type === 4);

        const ownerId = '789074847669288960';

        if (client.trackOwnerStatus && member.id === ownerId) {
            client.user.setPresence({
                status: 'dnd',
                activities: [
                    {
                        type: ActivityType.Playing,
                        name: customStatus ? customStatus.state : '',
                    },
                ],
            });
        }

        const role = guild.roles.cache.get('1222362167177642004');

        if (role) {
            if (customStatus && customStatus.state && (customStatus.state.toLowerCase().includes("lord") || customStatus.state.toLowerCase().includes("lord's") || customStatus.state.toLowerCase().includes("lords"))) {
                await member.roles.add(role);
            } else {
                await member.roles.remove(role);
            }
        }
    }
};