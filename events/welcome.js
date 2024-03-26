const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    execute: (member) => {
        const channelId = "1222278737261891674"

        console.log(member);

        const message = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Welcome to the server!')
            .setDescription(`Bienvenue à ${member.guild.name}, ${member}!\nTu es les ${member.guild.memberCount}ème membre!`)
            .setTimestamp()
            .setFooter({ text: member.user.username, iconURL: member.user.displayAvatarURL() });

        const channel = member.guild.channels.cache.get(channelId);

        channel.send({ embeds: [message] });
    }
};