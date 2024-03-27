const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ownerstatus')
        .setDescription('Set the bot status to track the owner status.')
        .addBooleanOption(option => 
            option.setName('track')
                .setDescription('Whether to track the owner status')
                .setRequired(true)),
    async execute(interaction) {
        interaction.client.trackOwnerStatus = interaction.options.getBoolean('track');
        if (!interaction.client.trackOwnerStatus) {
            await interaction.client.user.setPresence(interaction.client.defaultStatus);
        }
        await interaction.reply({
                content: `Owner status tracking is now ${interaction.client.trackOwnerStatus ? 'enabled' : 'disabled'}.`,
                ephemeral: true
            });
    },
    async handlePresenceUpdate(oldPresence, newPresence) {
        const client = newPresence.client;
        const guild = newPresence.guild;
        const member = guild.members.cache.get(newPresence.userId);
    
        const ownerId = '789074847669288960';
    
        if (client.trackOwnerStatus && member.id === ownerId) {
            client.user.setPresence({
                status: newPresence.status,
                activities: newPresence.activities,
            });
        }
    }
};