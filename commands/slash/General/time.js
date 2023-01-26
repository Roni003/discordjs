const { EmbedBuilder, Embed } = require('discord.js');

module.exports = {
    name: "date", // Name of command
    description: "Gives date", // Command description
    type: 1, // Command type
    options: [], // Command options
    permissions: {
        DEFAULT_PERMISSIONS: "", // Client permissions needed
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages" // User permissions needed
    },
    run: async (client, interaction, config, db) => {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription("The date: " + Date())
            ],
            ephemeral: true
        })
    },
};