/* const { EmbedBuilder } = require("discord.js");
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
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {

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


            //const proxiesRequest = await axios.get(this.apiurl + 'get-proxies'); 
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
            const accsnames = [];
            const url = "https://proxy.webshare.io/api/v2/proxy/list/?mode=direct&page=1&page_size=25";
            const param = {headers:{"Authorization": "Token 8b7zz7w8t544v8rh2ls8a9whn0qsulpac1mjhp5q"}}; //Webshare token
            const proxyList = (await axios.get(url, param)).data.results;
            //tokens = tokens.filter((token) => ((Date.now()/1000) - (token.last_token)) < 86400)
            //console.log(proxyList)

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
                for (let i = 0; i < tokens.length && i < proxyList.length; i++) {
                    const tmp = new Bot({
                        proxyHost: proxyList[i+1].proxy_address, //bcs 1sr proxy is used by autogrinder
                        proxyPort: proxyList[i+1].port,
                        proxyUser: proxyList[i].username, //Same for all anyways
                        proxyPassword: proxyList[i].password, //Same for all anyways
                        uuid: tokens[i].id,
                        username: tokens[i].name,
                        //token: tokens[i].access_token,
                    })

                    console.log(i)
                    console.log(proxyList[i].proxy_address)
                    console.log(proxyList[i].port)
                    console.log(`Connecting with proxy ${i+1}: ${proxyList[i].proxy_address}:${proxyList[i].port}`.yellow)
                    
                    random = randomInt(5,50);

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
 */