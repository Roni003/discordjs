const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const Bot = require("../../../reportBot");
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
let reportingInProgress = false;
module.exports = {
    name: "report",
    description: "Reports the user with all available tokens!",
    type: 1,
    options: [
        {
            name: "user",
            type: 3,
            description: "The user you want to report",
            required: true
        },

        /* {
            name: "How many times",
            type: 3,
            description: "Test desc",
            required: true
        } */
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {

        /* console.log(interaction) */
        if (interaction.guildId != config.Client.GUILD_ID) return interaction.reply({
            embeds: [
                new EmbedBuilder()

                    .setDescription("This command is only available in the support server!")
                    .setColor('Red')
                    .setTimestamp()
                        .setFooter({ text: 'Literally robbed Omi\'s code', iconURL: 'https://i.imgur.com/R8lsYLv.png' })
            ],
            ephemeral: true
        })

        /* if (!interaction.member.getId.equals("1056513874859401267")) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("You don't have enough permissions to use this command! Please be soge.")
                        .setColor('Red')
                        .setTimestamp()
                        .setFooter({ text: 'Literally robbed Omi\'s code', iconURL: 'https://i.imgur.com/R8lsYLv.png' })
                ],
                ephemeral: true
            })
        } */

        if (reportingInProgress) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("There is already a report in progress. Please wait until it is finished.")
                        .setColor('Red')
                        .setTimestamp()
                        .setFooter({ text: 'Literally robbed Omi\'s code', iconURL: 'https://i.imgur.com/R8lsYLv.png' })
                ],
                ephemeral: true
            })
        }


        const a = interaction.options.get('user')?.value;

        if (a != null && a != undefined && a != "") {
            // We have a string and it looks valid.
            // Do something with it.


            let res;
            /* const proxiesRequest = await axios.get(this.apiurl + 'get-proxies'); */
            try {
                //res = await axios.get(`http://omi.systems:5000/config/eecea3c7-c24f-4d6e-8bc7-17b5e8156cb8`);
            } catch (e) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error")
                            .setDescription("There was an error fetching the tokens. Please try again later.")
                            .setColor('Red')
                            .setTimestamp()
                        .setFooter({ text: 'Literally robbed Omi\'s code', iconURL: 'https://i.imgur.com/R8lsYLv.png' })
                    ],
                    ephemeral: true
                })
            }

            //let tokens = res.data.tokens ?? [];
            //const proxies = res.data.proxies ?? [];
            let tokens = [{
                id: "e661452e-27d9-4732-ac4a-c38d1ed6f721",
                name: "47nalt7@gmail.com",
                access_token: ""
            }

            ]
            const proxies = [{
                ip: "104.238.20.15",
                port: "5637",
                username: "tpxnylxr",
                password: "mdy9vt8i48st"    
            }
            ];

            //console.log(tokens)
            tokens = tokens.filter((token) => ((Date.now()/1000) - (token.last_token)) < 86400)
            reportingInProgress = true;
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Rerporting ${a}`)
                        .setDescription("There are " + tokens.length + " active tokens. Please wait while we report the user...")
                        .setColor('Blue')
                        .setTimestamp()
                        .setFooter({ text: 'Literally robbed Omi\'s code', iconURL: 'https://i.imgur.com/R8lsYLv.png' })
                ],
            });
            try {
                for (let i = 0; i < tokens.length && i < proxies.length; i++) {

                    const tmp = new Bot({
                        proxyHost: proxies[i].ip,
                        proxyPort: proxies[i].port,
                        proxyUser: proxies[i].username,
                        proxyPassword: proxies[i].password,
                        uuid: tokens[i].id,
                        username: tokens[i].name,
                        //token: tokens[i].access_token,
                    })

                    /* const tmp = new Bot({
                        proxyHost: "104.238.20.15",
                        proxyPort: "5637",
                        proxyUser: "tpxnylxr",
                        proxyPassword: "mdy9vt8i48st",
                        uuid: "e661452e-27d9-4732-ac4a-c38d1ed6f721",
                        username: tokens[i].name,
                        token: tokens[i].access_token,
                    }) */

                    await tmp.awaitOnline();
                    await sleep(1000);
                    console.log("Sent message")
                    await tmp.sendChatMessage("/f " + a);
                    await sleep(2000);
                    await tmp.stop();

                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Rerporting ${a}`)
                                .setDescription("Reported " + (parseInt(i)+1) + "/" + tokens.length + " times.")
                                .setColor('Blue')
                                .setTimestamp()
                                .setFooter({ text: 'Literally robbed Omi\'s code', iconURL: 'https://i.imgur.com/R8lsYLv.png' })
                        ],
                    })
                }
            } catch (e) { console.log("ERROR") }

            reportingInProgress = false;
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Reporting ${a}`)
                        .setDescription("Reporting completed!")
                        .setColor('Green')
                        .setTimestamp()
                        .setFooter({ text: 'Literally robbed Omi\'s code', iconURL: 'https://i.imgur.com/R8lsYLv.png' })
                ],
            })

        } else {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Invalid ign provided: ${a}`)
                        .setColor('Red')
                        .setTimestamp()
                        .setFooter({ text: 'Literally robbed Omi\'s code', iconURL: 'https://i.imgur.com/R8lsYLv.png' })
                ],
                ephemeral: true
            })
        }



    },
};
