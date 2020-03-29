// import { Client } from "discord.js";

// const client = new Client();

const Discord = require('discord.js');
const client = new Discord.Client();
require("dotenv").config();

client.on("message", message => {
  if (message.author.bot) {
    return; // Do nothing
  }

  const messageText = message.content;
  if (!messageText.startsWith(".b")) {
    return; // Ignore, the message wasn't for the bot
  }

  if (messageText.slice(2).trim().toLowerCase() === 'invite') {
    message.reply(`click here to invite the bot to your own server!
    <https://discordapp.com/api/oauth2/authorize?client_id=693559759080521768&scope=bot&permissions=68672>`);
    return;
  }
  

  const argumentsArray = messageText
    .slice(2)
    .trim()
    .split(" ");
    if (!checkArray(argumentsArray)) {
      message.react('❓');
      return;
    };

  const numberToAdd = parseInt(argumentsArray[0]);
  const diceToRoll =
    2 + (argumentsArray.length > 1 ? argumentsArray[1].length : 0);
  const modifier = argumentsArray.length > 1 ? argumentsArray[1] : 0;

  const diceResults = roller(diceToRoll);
  const sortedDice = sortDice(diceResults, modifier);

  const diceResult = sortedDice.reduce((a, b) => a + b, 0);
  const totalResult = diceResult + numberToAdd;

  message.reply(`
  **Dice Results:** ${diceResults.join(", ")}
  **Total Result:**  ${sortedDice.join(" + ")} + ${numberToAdd} = ${totalResult}`
  );

});

function roller(numRolled) {
  const results = [];
  let times = 0;
  do {
    let rando = Math.floor(Math.random() * 6 + 1);
    results.push(rando);
    times++;
  } while (times < numRolled);
  return results;
}

function sortDice(arr, mod) {
  if (!mod || !mod.startsWith("-"))
    return [...arr]
      .sort()
      .reverse()
      .slice(0, 2);
  return [...arr].sort().slice(0, 2);
}

function checkArray(arr) {
  if (arr.length > 2) return false;
  if (arr[0] === "") return false;
  if (typeof parseInt(arr[0]) !== "number") return false;
  if (arr[1] && arr[1].length > 2) return false;
  if (arr[1] === "-" || arr[1] === "+" || arr[1] === "--" || arr[1] === "++")
    return true;
  return true;
}

function messageHandler() {
  const argumentsArray = messageText
    .slice(2)
    .trim()
    .split(" ");
  if (!checkArray(argumentsArray)) return;

  const numberToAdd = parseInt(argumentsArray[0]);
  const diceToRoll =
    2 + (argumentsArray.length > 1 ? argumentsArray[1].length : 0);
  const modifier = argumentsArray.length > 1 ? argumentsArray[1] : 0;

  const diceResults = roller(diceToRoll);
  const sortedDice = sortDice(diceResults, modifier);

  const diceResult = sortedDice.reduce((a, b) => a + b, 0);
  const totalResult = diceResult + numberToAdd;
}






client.login(process.env.DISCORD_TOKEN);