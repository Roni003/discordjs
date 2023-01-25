const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('Replies with the date'),
	async execute(interaction) {
		await interaction.reply('Today is: ' + Date());
	},
};