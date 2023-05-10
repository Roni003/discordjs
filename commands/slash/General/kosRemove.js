const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

function getUUID(playername) {
	return fetch(`https://api.mojang.com/users/profiles/minecraft/${playername}`)
		.then((data) => data.json())
		.then((player) => player.id);
}

module.exports = {
	name: "kos-remove", // Name of command
	description: "Remove a player to the KOS list", // Command description
	type: 1, // Command type
	options: [
		{
			name: "player",
			description: "Player to remove from the KOS list",
			type: 3,
			required: true,
		},
	], // Command options
	permissions: {
		DEFAULT_PERMISSIONS: "", // Client permissions needed
		DEFAULT_MEMBER_PERMISSIONS: "SendMessages", // User permissions needed
	},
	run: async (client, interaction, config, db) => {
		if (!config.Users.OWNERS.includes(interaction.user.id)) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("KOS Bot")
						.setDescription("You don't have access to this command")
						.setColor("Red"),
				],
				ephemeral: true,
			});
		}

		const player = interaction.options.getString("player");
		const uuid = await getUUID(player);

		fs.readFile("./koslist.json", "utf8", (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			const koslist = JSON.parse(data);

			if (!koslist.includes(uuid)) {
				return interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle("KOS Bot")
							.setDescription(
								"Player " + player + " was not on the KOS list"
							)
							.setColor("Red"),
					],
					ephemeral: true,
				});
			}

			koslist.splice(koslist.indexOf(uuid), 1);

			fs.writeFile(
				"./koslist.json",
				JSON.stringify(koslist, null, 4),
				(err) => {
					if (err) {
						console.error(err);
						return;
					}
				}
			);

			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("KOS Bot")
						.setDescription("Player " + player + " remove from the KOS list")
						.setColor("Green"),
				],
				ephemeral: true,
			});
		});
	},
};
