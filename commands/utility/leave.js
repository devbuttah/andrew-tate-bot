const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder().setName('leave').setDescription('Leaves the VC'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            return interaction.reply({
                content: 'I am not in a voice channel.',
                ephemeral: true,
            });
        }

        connection.destroy();

        await interaction.reply('Left the voice channel.');
    },
};