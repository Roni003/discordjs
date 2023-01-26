const client = require("../../index");
const config = require('../../config/config.js');
const colors = require("colors");
const { token } = require("../../index");

module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {
  tokenobf = client.token.substring(0,8) + "..." +  client.token.substring(client.token.length-8, client.token.length);
  console.log("\n" + `[READY] ${config.Users.OWNER_NAME}'s bot is up and ready to go, token: ${tokenobf}`.brightGreen);
})