const { MessageEmbed } = require('discord.js');

const dice = [
  {result: 1, emoji: '<:Result1:768110374742130698>'},
  {result: 2, emoji: '<:Result2:768110374570164285>'},
  {result: 3, emoji: '<:Result3:768110375131938816>'},
  {result: 4, emoji: '<:Result4:768110375006502914>'},
  {result: 5, emoji: '<:Result5:768110375275069460>'},
  {result: 6, emoji: '<:Result6:768110375416889344>'},
]

function rollADie() {
  return Math.floor(Math.random() * 6);
}

function getDiceResults(num) {
  let timesRolled = 0;
  const diceResults = [];
  while (timesRolled < num) {
    diceResults.push(dice[rollADie()]);
    timesRolled++;
  };
  const finalResults = {
    results: diceResults,
    sorted: Array.from(diceResults).sort( (a, b) => b.result - a.result),
    revSorted: Array.from(diceResults).sort((a, b) => a.result - b.result)
  };
  return finalResults;
}

function parseArgs(string) {
  const regex = /([-+]?\d+)? ?(?:(\+{1,2}|\-{1,2}))?/i;
  const match = string.match(regex);
  return match;
}

function generateOutput(staticBonus, diceObj, edgeObs, who) {
  let useWhich;
  switch (edgeObs) {
    case '+':
    case '++':
     useWhich = diceObj.sorted;
      break;
    case '-':
    case '--':
     useWhich = diceObj.revSorted;
      break;
    default:
     useWhich = diceObj.results;
      break;
  };
  const actualRoll = diceObj.results;
  const emojis = Array.from(diceObj.results).map(el => el.emoji);
  const totalResult = parseInt(staticBonus) + useWhich[0].result + useWhich[1].result;
  const embed = new MessageEmbed()
  .setColor('#E83278')
  .setTitle(`You got a ${totalResult} total!`)
  .addField(`Use Dice`, `${useWhich[0].emoji} + ${useWhich[1].emoji} ${staticBonus < 0 ? '' : '+'} ${parseInt(staticBonus)}`)
  .addField('Dice results', `${emojis.join(' ')}`)
  .setFooter(`${who.username}`, who.avatarURL());;

  return embed;
}

module.exports = {
  name: "roll",
  description: "roll 2d6 and add a number to it. Add `+` at the end to roll with a minor edge. Add `++` at the end to roll with a major edge. Use `-` and `--` for minor/major obstacle.",
  aliases: ["r", "dice"],
  usage: " [number to add] [optional edge/obstacle]",
  cooldown: 5,
  execute(message, args) {
    let [ ignored, staticBonus, edgeObs] = parseArgs(args.join(' '));
    if (typeof(staticBonus) === 'undefined') staticBonus = 0;
    let diceToRoll = 2;
    if (edgeObs) {
      diceToRoll += edgeObs.length;
    }
    const diceResults = getDiceResults(diceToRoll);
    const output = generateOutput(staticBonus, diceResults, edgeObs, message.author.username);
    message.reply({embed: output});

  }
};
