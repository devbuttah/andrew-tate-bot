require('libsodium-wrappers');

const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
} = require('@discordjs/voice');

const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    cooldown: 5,

    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a random motivation MP3'),

    async execute(interaction) {
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply({
                content: 'Join a voice channel first.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const audioFolder = path.join(__dirname, '../../audio');

        const files = fs
            .readdirSync(audioFolder)
            .filter(file => file.endsWith('.mp3'));

        if (files.length === 0) {
            return interaction.reply({
                content: 'No MP3 files found in the audio folder.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const chosenFile = files[Math.floor(Math.random() * files.length)];
        const filePath = path.join(audioFolder, chosenFile);

        console.log('Playing file:', filePath);

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(filePath);

        connection.subscribe(player);
        player.play(resource);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('Audio is now playing.');
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log('Audio finished.');

            try {
                connection.destroy();
            } catch {}
        });

        player.on('error', error => {
            console.error('Audio error:', error);
        });

        await interaction.reply(`Playing Motivation 🔥`);
    },
};