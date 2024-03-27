const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Recréer un salon')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Salon à recréer')),
    async execute(interaction) {
        const channelOption = interaction.options.getChannel('channel');
        if (channelOption) {
            if (channelOption.type === 'GUILD_CATEGORY') {
                await interaction.reply({ content: "Vous ne pouvez pas réinitialiser une catégorie.", ephemeral: true });
                return;
            }

            const channelToClone = interaction.guild.channels.cache.get(channelOption.id);
            if (channelToClone) {
                const newChannel = await channelToClone.clone();
                const message = await newChannel.send(`Le salon ${newChannel.name} a été recréé avec succès. ${interaction.user}`);
                await channelToClone.delete();
                await interaction.reply({ content: `Le salon ${newChannel.name} a été recréé avec succès.`, ephemeral: true });
                
                setTimeout(async () => {
                    await message.delete();
                }, 3000);
            } else {
                await interaction.reply({ content: "Le salon à recréer n'a pas été trouvé.", ephemeral: true });
            }
        } else {
            await interaction.reply({ content: "Veuillez spécifier un salon à recréer.", ephemeral: true });
        }
    },
};
