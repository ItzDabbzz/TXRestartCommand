/// <reference path="../../node_modules/@citizenfx/server/natives_server.d.ts" />
let Config = require('./config.json')
const webhook = require("webhook-discord")
const axios = require("axios").default;
const Hook = new webhook.Webhook(Config.DISCORD_WEBHOOK);
let ESX = null;

emit("esx:getSharedObject", (obj) => ESX = obj);

async function TX(path, data) {
  const url = Config.URL;
  return await axios({
    method: "GET",
    data,
    headers: {'Accept': 'application/json, text/javascript, */*; q=0.01', 'Cookie': `txAdmin:default:sess=${Config.sess}; txAdmin:default:sess.sig=${Config.sig}`},
    url: `${url}${path}`,
  });
};

onNet("trs:Restart", () => {
  console.log("YOU DID IT")
  TX("/fxserver/controls/restart", {}).catch(console.error);
  CancelEvent();
});


RegisterCommand("txrestart", async (source, args) => {
  CancelEvent();
  let Playername = GetPlayerName(source);
  emitNet("chatMessage", -1, "SERVER BOT", [255, 0, 0], 'Server Restarting...')
  const msg = new webhook.MessageBuilder()
  .setName("Server Restart")
  .setColor("#42f5ce")
  .setFooter("Server Restart By ItzDabbzz and enc0ded")
  .setText(`Server Is Restarting By ${Playername}`);
  Hook.send(msg);

  Wait(2000);
  let remainingPlayers = await ESX.Game.GetPlayers()

  remainingPlayers.forEach(async p => {
    console.log(p)
  })

  setImmediate(() => {
    emitNet("trs:Restart", {});
  });
});
