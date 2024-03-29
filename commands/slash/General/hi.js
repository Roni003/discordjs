const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "hi",
    description: "Greets you",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(client.user.username + " says hi")
                    .setColor("Green")
                    //.setAuthor(client) //Sets the author of the embed as client.name
                    .setTitle("Greeting")
            ],
            ephemeral: true
        })
    },
};
