const { MessageEmbed } = require('discord.js');

function rollADie() {
  return Math.floor(Math.random() * 6) +1;
}

function getDiceResults(num) {
  let timesRolled = 0;
  const diceResults = [];
  while (timesRolled < num) {
    diceResults.push(rollADie());
    timesRolled++;
  };
  const finalResults = {
    results: diceResults,
    sorted: Array.from(diceResults).sort(),
    revSorted: Array.from(diceResults).sort().reverse(),
  };
  return finalResults;
}

function parseArgs(string) {
  const regex = /([-+]?\d+)? ?(?:(\+{1,2}|\-{1,2}))?/i;
  const match = string.match(regex);
  return match;
}

function generateOutput(staticBonus, diceObj, edgeObs) {
  let useWhich;
  switch (edgeObs) {
    case '+':
    case '++':
     useWhich = diceObj.revSorted;
      break;
    case '-':
    case '--':
     useWhich = diceObj.sorted;
      break;
    default:
     useWhich = diceObj.results;
      break;
  };
  const actualRoll = diceObj.results;
  const totalResult = parseInt(staticBonus) + parseInt(useWhich[0]) + parseInt(useWhich[1]);
  const embed = new MessageEmbed()
  .setColor('#E83278')
  .setTitle(`You got a ${totalResult} total!`)
  .addField(`Use Dice`, `${useWhich[0]} + ${useWhich[1]} ${staticBonus < 0 ? '' : '+'} ${parseInt(staticBonus)}`)
  .addField('Dice results', `${useWhich.join(', ')}`);

  return embed;
}

module.exports = {
  name: "roll",
  description: "roll 2d6 and add a number to it. Add `+` at the end to roll with a minor edge. Add `++` at the end to roll with a major edge. Use `-` and `--` for minor/major obstacle.",
  aliases: ["r", "dice"],
  usage: " [number to add] [optional edge/obstacle]",
  cooldown: 5,
  args: true,
  execute(message, args) {
    let [ ignored, staticBonus, edgeObs] = parseArgs(args.join(' '));
    if (typeof(staticBonus) === 'undefined') staticBonus = 0;
    let diceToRoll = 2;
    if (edgeObs) {
      diceToRoll += edgeObs.length;
    }
    const diceResults = getDiceResults(diceToRoll);
    const output = generateOutput(staticBonus, diceResults, edgeObs);
    message.reply({embed: output});

  }
};
