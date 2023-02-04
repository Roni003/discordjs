const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const list = require("../../../config/list");
const Bot = require("../../../reportBot");
const { randomInt } = require("mathjs");
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

            let counter = 0;
            let random;
            let names;
            const reportType = ["bhop", "boo", "ka", "killaura", "velocity", "antikb", "boo", "cheating", "bhop", "killaura"]
            let tokens = list.tokens ?? [];
            const proxies = list.proxies ?? [];
            const accsnames = [];

            //onsole.log(tokens)
            //tokens = tokens.filter((token) => ((Date.now()/1000) - (token.last_token)) < 86400)

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
                //console.log(tokens.length + " , " + proxies.length)
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

                    
                    random = randomInt(5,25);

                    console.log(`Waiting ${random} seconds`.brightGreen);
                    await tmp.awaitOnline();
                    await sleep(6000);
                    await tmp.sendChatMessage("/play pit"); //Play pit beforehand
                    await sleep(random*1000);
                    accsnames.push(tmp.getName()); //List of all names

                    random = randomInt(0, reportType.length);
                    console.log(`Reporting with type ${reportType[random]}`.brightGreen);
                    await tmp.sendChatMessage("/report " + a + " " + reportType[random]); //Reports user
                    counter++;
                    console.log(`Reported ${a} with account: ${tmp.getName()}`.brightGreen);
                    await sleep(4000); 
                    await tmp.stop();

                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Rerporting ${a}`)
                                .setDescription("Reported " + (parseInt(i)+1) + "/" + tokens.length + " times")
                                .setColor('Blue')
                                .setTimestamp()
                                .setFooter({ text: 'Literally robbed Omi\'s code', iconURL: 'https://i.imgur.com/R8lsYLv.png' })
                        ],
                    })
                }
            } catch (e) { console.log("ERROR") }
            n
            names = JSON.stringify(accsnames);
            reportingInProgress = false;
            console.log(`Finished Reporting`.red);

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Reporting ${a}`)
                        .setDescription("Reporting completed, reported user with " + counter + " accounts | Used accounts " + names)
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
