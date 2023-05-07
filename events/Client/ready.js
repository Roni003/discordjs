const { EmbedBuilder } = require("discord.js");
const client = require("../../index");
const config = require('../../config/config.js');
const colors = require("colors");
const { token } = require("../../index");
const { map, count } = require("mathjs");

function getStaffXp(staffList) {
  let staffXP = new Map();

  staffList.forEach((staff) => {
    getUUID(staff).then((uuid) => {
      fetch(`https://api.slothpixel.me/api/guilds/${staff}`).then((res) => res.json()).then((json) => {
        json.members.forEach((member) => {
          if(member.uuid == uuid) {
            try {
              let dailyXP = member.exp_history[Object.keys(member.exp_history)[0]];
              //console.log(`${staff} (${uuid})'s XP: ${dailyXP}`);
              staffXP.set(staff, dailyXP);
            } catch (error) {
              console.log(`[ERROR] ${staff}`);
            }
            
          } 
        })
      })
    }); 
  })

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(staffXP);
    }, 1000);
  });
}

function getUUID(playername) {
  return fetch(`https://api.mojang.com/users/profiles/minecraft/${playername}`)
    .then(data => data.json())
    .then(player => player.id);
}

function clearChannel(channel) {
  channel.messages.fetch()
    .then(messages => {
      messages.forEach(msg => {
        msg.delete()
          .then(deletedMessage => console.log(`Deleted message ${deletedMessage.id}`))
          .catch(console.error);
      });
    })
    .catch(console.error);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {
  tokenobf = client.token.substring(0,8) + "..." +  client.token.substring(client.token.length-8, client.token.length);
  console.log("\n" + `[READY] ${config.Users.OWNER_NAME}'s bot is up and ready to go, token: ${tokenobf}`.brightGreen);

    const channelId = '1068325027847622736';
    let channel = client.channels.cache.get(channelId);
    let staffList = ["Rhune", "Pensul", "Gerbor12", "MCVisuals", "lebrillant", "smoarzified", "Ladybleu", "Cheesey"];
    let counters = new Map();
    let msg;
    let onlineStaff = [];
    let offlineStaff = [];

    //Set all the counters to 16
    for(let i = 0; i < staffList.length; i++) {
      counters.set(staffList[i], 16);
    }

    //Clear out all the past messages in the channel
    clearChannel(channel);

    getStaffXp(staffList).then((tempXP) => {
        if (channel) {
          msg = channel.send({embeds: [new EmbedBuilder().setColor("Orange").setTitle("Checker Started, waiting 16 minutes for accurate results").setDescription("Loading...")]});
        } else {
          console.error(`Unable to find channel with ID ${channelId}`);
        }

        //Wait 16 mins for accurate results
        sleep(1000 * 60 * 16).then(() => {
          setInterval(() => {
          msg.then((message) => {
            getStaffXp(staffList).then((staffXP) => {
              

              //Compare guild xp of each staff to see if it has changed in the last minute
              staffXP.forEach((xp, staff) => {
                if(xp > tempXP.get(staff)) {
                  counters.set(staff, 0);
                } else {
                  counters.set(staff, counters.get(staff) + 1);
                }
              });

              //If staff has been offline for longer than 16mins, add them to the offline list
              counters.forEach((count, staff) => {
                if(count >= 16 && offlineStaff.indexOf(staff) == -1) {
                  offlineStaff.push(staff);
                  onlineStaff.splice(onlineStaff.indexOf(staff), 1);
                } else if(count < 16 && offlineStaff.indexOf(staff) != -1) {
                  //If the counter is less than 16, meaning their xp updated in the last 16mins, add them to online list
                  onlineStaff.push(staff);
                  offlineStaff.splice(offlineStaff.indexOf(staff), 1);
                }
              });

              tempXP = staffXP;

              message.edit({
              embeds: [new EmbedBuilder()
                      .setColor("Green")
                      .setTitle("Online staff")
                      .setDescription(onlineStaff.toString() || "No staff online"),
                      new EmbedBuilder()
                      .setColor("Red")
                      .setTitle("Offline staff")
                      .setDescription(offlineStaff.toString() || "No staff offline")
                    ]
                  });
                });
              });
            }, 1000 * 60);
        });          
    });
})