const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Joins the VC'),

    async execute(interaction) {
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply({
                content: 'You must be in a voice channel first.',
                ephemeral: true,
            });
        }

        const existingConnection = getVoiceConnection(interaction.guild.id);

        if (existingConnection) {
            existingConnection.destroy();
        }

        try {
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            await interaction.reply('Joined!');
        } catch (error) {
            console.error(error);

            await interaction.reply({
                content: 'Failed to join the voice channel.',
                ephemeral: true,
            });
        }
    },
};