const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    execute: (member) => {
        const channelId = "1222278737261891674"

        console.log(member);

        const message = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Welcome to the server!')
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(`Bienvenue à ${member.guild.name}, ${member}!\nTu es le ${member.guild.memberCount}ème membre!`)
            .setTimestamp()
            .setFooter({ text: member.user.username, iconURL: member.guild.iconURL() });

        const channel = member.guild.channels.cache.get(channelId);

        channel.send({ embeds: [message] });
    }
};