const client = require("../../index");
const config = require('../../config/config.js');
const colors = require("colors");

module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {
  console.log("\n" + `[READY] ${config.Prefix} is up and ready to go.`.brightGreen);
})