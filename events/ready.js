const { Events } = require('discord.js');
const { ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {

		client.defaultStatus = {
			status: 'dnd',
			activities: [
				{
					type: ActivityType.Playing,
					name: 'in development',
					state: 'in development',
				},
			],
		};

		await client.user.setPresence(client.defaultStatus);

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};