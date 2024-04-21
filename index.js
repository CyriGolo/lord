const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const app = express();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}



// CHATBOX

app.use(express.json());

app.post('/create-channel', async (req, res) => {
    const channelId = "1231410839010021398";
    const channel = await client.channels.fetch(channelId);


    await channel.threads.create({
        name: req.body.title,
        autoArchiveDuration: "60",
        message: {
        content: req.body.message,
        },
        reason: 'Try to create a channel',
    })
    .then(threadChannel => console.log("New thread create : " + threadChannel.name))
    .catch(console.error);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use(express.static(path.join(__dirname, "chatbox")));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chatbox', 'index.html'));
});



// LOGIN

client.login(token);