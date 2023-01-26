const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Replies with your ping",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        console.log("c:" + client + "\ni: " + interaction + "\n config: " + config + "\ndb: " + db )
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(client.ws.ping + "ms!")
                    .setColor('Blue')
            ],
            
            ephemeral: true
        })
    },
};
