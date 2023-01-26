const mc = require('minecraft-protocol')
const socks = require('socks').SocksClient
const mineflayer = require('mineflayer')
const EventEmitter = require('events');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class Bot extends EventEmitter {

    online = false;
    started = false;


    constructor(configIn) {
        super();
        this.config = configIn;
        this.createBot();
    }

    createBot() {




        const client = mc.createClient({
            connect: client => {
                socks.createConnection({
                    proxy: {
                        host: this.config.proxyHost,
                        port: parseInt(this.config.proxyPort),
                        type: 5,
                        userId: this.config.proxyUser,
                        password: this.config.proxyPassword
                    },
                    command: 'connect',
                    destination: {
                        host: "mc.hypixel.net",
                        port: 25565
                    }
                }, (err, info) => {
                    if (err) {
                        console.log(err)
                        return
                    }

                    client.setSocket(info.socket)
                    client.emit('connect')
                })
            },

            host: "stuck.hypixel.net",
            port: 25565,
            username: this.config.username,
            auth: 'mojang',
            version: '1.8.9',
            session: {
                accessToken: this.config.token,
                selectedProfile: {
                    id: this.config.uuid,
                    name: this.config.username,
                    skins: [],
                    capes: []
                },
                availableProfile: [
                    {
                        id: this.config.uuid,
                        name: this.config.username,
                        skins: [],
                        capes: []
                    }
                ]
            },
            skipValidation: true,
            
        })

        const newBot = mineflayer.createBot({ client: client, hideErrors: true, viewDistance: "tiny" });

        this.bot = newBot;

        this.bot.on('messagestr', async (message) => {

            console.log(message)
        })
        
    

        this.bot.once('spawn', async () => {

            console.log(`[${this.config.username}] Spawned!`)


        })

        this.bot.once('kicked', (reason) => {
            //console.log(reason)
            console.log(reason);
        });
        this.bot.once('end', (reason) => {
            //console.log(reason)
            console.log(reason);
        });
    }


    getStatus() {
        return this.online;
    }

    awaitOnline() {
        return new Promise(resolve => {
            if (this.online) {
                resolve()
            } else {
                this.bot.once('spawn', () => {
                    resolve("Online");
                });
                this.bot.once('kicked', (reason) => {
                    //console.log(reason)
                    resolve(reason);
                });
                this.bot.once('end', (reason) => {
                    //console.log(reason)
                    resolve(reason);
                });
            }
        })
    }

    stop() {
        this.bot.quit();
    }

    sendChatMessage(message) {
        this.bot.chat(message);
    }
}

module.exports = Bot;