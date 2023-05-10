const { EmbedBuilder } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");
const colors = require("colors");
const { token } = require("../../index");
const { map, count } = require("mathjs");
const fs = require("fs");
const { get } = require("http");
const { on } = require("events");
const { off } = require("process");
const { type } = require("os");

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function clearChannel(channel) {
	channel.messages
		.fetch()
		.then((messages) => {
			messages.forEach((msg) => {
				msg
					.delete()
					.then((deletedMessage) =>
						console.log(`Deleted message ${deletedMessage.id}`)
					)
					.catch(console.error);
			});
		})
		.catch(console.error);
}

async function getUUID(playername) {
	let res = await fetch(
		`https://api.mojang.com/users/profiles/minecraft/${playername}`
	);
	let data = await res.json();
	return data.id;
	/* 
	return fetch(`https://api.mojang.com/users/profiles/minecraft/${playername}`)
		.then((data) => data.json())
		.then((player) => player.id); */
}

function getKOSList() {
	return new Promise((resolve, reject) => {
		fs.readFile("./koslist.json", "utf8", (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			const koslist = JSON.parse(data);

			resolve(koslist);
		});
	});
}

async function getPlayerInfo(uuid) {
	const data = await fetch(`https://pitpanda.rocks/api/players/${uuid}`);
	return await data.json();
}

/* async function getKOSInfo(koslist) {
	return new Promise((resolve, reject) => {
		let KOSInfo = new Array();
		for (let i = 0; i < koslist.length; i++) {
			sleep(1000).then(() => {
				getPlayerInfo(koslist[i]).then((player) => {
					KOSInfo.push({
						name: player.data.name,
						online: player.data.online,
						bounty: player.data.doc.bounty,
						megastreak:
							player.data.inventories.killstreaks[0].name.substring(2),
						helmet: Object.values(player.data.inventories.armor)[0].name,
						leggings: [
							Object.values(player.data.inventories.armor)[2].name,
							Object.values(player.data.inventories.armor)[2].desc,
						],
						skin: "https://crafatar.com/avatars/" + player.data.uuid,
					});

					if (i == koslist.length - 1) {
						resolve(KOSInfo);
					}
				});
			});
		}
	});
} */

async function getKOSInfo(kosList) {
	let kosInfo = new Array();
	for (let i = 0; i < kosList.length; i++) {
		await sleep(2000);
		const player = await getPlayerInfo(kosList[i]);
		kosInfo.push({
			name: player.data.name,
			online: player.data.online,
			bounty: player.data.doc.bounty,
			megastreak: player.data.inventories.killstreaks[0].name.substring(2),
			helmet: Object.values(player.data.inventories.armor)[0].name,
			leggings: [
				Object.values(player.data.inventories.armor)[2].name,
				Object.values(player.data.inventories.armor)[2].desc,
			],
			skin: "https://crafatar.com/avatars/" + player.data.uuid,
		});
	}
	return kosInfo;
}

function removeColorCodes(str) {
	if (str == "" || str == null) return "";
	return str.replace(/§[0-9a-fklmnor]/gi, "");
}

client.once("ready", async () => {
	const channelId = "1068325027847622736";
	let channel = client.channels.cache.get(channelId);

	clearChannel(channel);

	if (channel) {
		msg = channel.send({
			embeds: [
				new EmbedBuilder()
					.setColor("Orange")
					.setTitle("KOS Bot started")
					.setDescription("KOS Bot is now online! Waiting for data...	"),
			],
		});
	} else {
		console.error(`Unable to find channel with ID ${channelId}`);
	}

	setInterval(() => {
		getKOSList().then((koslist) => {
			getKOSInfo(koslist).then((KOSInfo) => {
				let online = "";
				let offline = "";

				KOSInfo.forEach((element) => {
					let desc = "";
					if (typeof element.leggings[1] == "object") {
						element.leggings[1].forEach((row) => {
							if (
								row.includes("I") ||
								row.includes("II") ||
								row.includes("III")
							) {
								desc += removeColorCodes(row) + " ";
							}
						});
						desc = "(" + desc.substring(0, desc.length - 1) + ")";
					}

					if (element.online) {
						online += `${element.name} (Bounty: ${
							element.bounty
						}g) Mega: ${element.megastreak.toUpperCase()}\n 
						${removeColorCodes(element.helmet)} | Pants: ${removeColorCodes(
							element.leggings[0]
						)} ${desc} \n------------------------------------------------------------\n`;
					} else {
						offline += `${element.name} (Bounty: ${
							element.bounty
						}g) Mega: ${element.megastreak.toUpperCase()}\n 
						${removeColorCodes(element.helmet)} | Pants: ${removeColorCodes(
							element.leggings[0]
						)} ${desc} \n------------------------------------------------------------\n`;
					}
				});

				msg.then((message) => {
					message.edit({
						embeds: [
							new EmbedBuilder()
								.setColor("Red")
								.setTitle("Offline")
								.setDescription(offline),
							new EmbedBuilder()
								.setColor("Green")
								.setTitle("Online")
								.setDescription(online),
						],
					});
				});
			});
		});
	}, 1000 * (45 + koslist.length * 2));
});
