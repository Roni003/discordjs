const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "hi",
    description: "Greets you",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db, color = 'Red') => {
        //console.log(client.user)
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(client.user.username + " says hi")
                    .setColor(color)
                    //.setAuthor(client) //Sets the author of the embed as client.name
                    .setTitle("Greeting")
            ],
            ephemeral: true
        })
    },
};
