require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', () => {
    console.log('Online!');
});

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

const channelsToMonitor = ['1084837313890238627', '998939375717072976',];

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    if (!channelsToMonitor.includes(message.channel.id)) return;
    
    if (message.content.startsWith("!")) return;

    let conversationLog = [{ role: 'system', content: "Ur mom" }];

    conversationLog.push({
        role: 'user',
        content: message.content,
    });
    
    await message.channel.sendTyping();

    const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
    });

    message.reply(result.data.choices[0].message);
});

client.login(process.env.TOKEN);
