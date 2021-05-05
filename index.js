const discord = require('discord.js');
const { token } = require('./config.json');
const ytdl = require('ytdl-core');


// Command prefix
prefix = '+'

const client = new discord.Client();

client.login(token)

client.on('ready', () => {
    console.log('Client is ready.');
});
client.on('disconnect', () => {
    console.log('Client disconnected.');
});

// Main functionality
client.on('message', async message => {

    if (!message.guild) return;
    else if (message.author === client.user) return;
    else if (!message.content.startsWith(prefix)) return;
    else {
        if (message.content.startsWith(`${prefix}play`)) {
            play(message);
            return;       
        }
    }

});

let session = null;

async function play(message) {
    const args = message.content.split(' ');

    const voiceChannel = message.member.voice.channel;
    const textChannel = message.channel;
    if (voiceChannel) {
        if (!session) {
            const connection = await voiceChannel.join();
            console.log(`Joined channel "${voiceChannel.name}"`);

            session = {
                textChannel: textChannel,
                voiceChannel: voiceChannel,
                connection: connection,
                songQueue: []
            }

            session.songQueue.push('https://www.youtube.com/watch?v=1EXxw7DcvUA')
            play_loop();
        } else {
            session.songQueue.push('https://www.youtube.com/watch?v=1EXxw7DcvUA')
        }

        
    } else {
        message.reply("You must be in a voice channel")
    }
}

function play_loop() {
    console.log(session.songQueue);
    if (!session.songQueue.length) {
        session.voiceChannel.leave();
        console.log(`Left channel ${session.voiceChannel.name}`);
        session = null;
    } else {
        session.connection.play(ytdl(session.songQueue.shift()))
            .on('finish', () => {
                play_loop();
            });
    }
}