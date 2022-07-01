const { Client, Discord } = require("discord.js");
const chalk = require("chalk");
const client = new Client({intents: 32767,});
require("dotenv").config();

client.on("messageCreate", async (messageCreate) => {
  if (messageCreate.author.bot) return;
  let msg = messageCreate.content;

  let emojis = msg.match(/(?<=:)([^:\s]+)(?=:)/g)
  if (!emojis) return;
  emojis.forEach(m => {
    let emoji = client.emojis.cache.find(x => x.name === m)
    if (!emoji) return;
    let temp = emoji.toString()
    if (new RegExp(temp, "g").test(msg)) msg = msg.replace(new RegExp(temp, "g"), emoji.toString())
    else msg = msg.replace(new RegExp(":" + m + ":", "g"), emoji.toString());
  })

  if (msg === messageCreate.content) return;

  let webhook = await messageCreate.channel.fetchWebhooks();
  let number = randomNumber(1, 2);
  webhook = webhook.find(x => x.name === "SESTRO" + number);

  if (!webhook) {
    webhook = await messageCreate.channel.createWebhook(`SESTRO` + number, {
      avatar: client.user.displayAvatarURL({ dynamic: true })
    });
  }

  await webhook.edit({
    name: messageCreate.member.nickname ? messageCreate.member.nickname : messageCreate.author.username,
    avatar: messageCreate.author.displayAvatarURL({ dynamic: true })
  })

  messageCreate.delete().catch(err => { })
  webhook.send(msg).catch(err => { })

  await webhook.edit({
    name: `SESTRO` + number,
    avatar: client.user.displayAvatarURL({ dynamic: true })
  })


})
function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 
client.on("ready", () => {
  (console.log(
    chalk.blue("Hey brah ") + chalk.cyan(`Your Bot Started`))
  )
  client.user.setActivity("With Sestro");
})
client.login(process.env.TOKEN);

