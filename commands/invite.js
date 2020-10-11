module.exports = {
  name: 'invite',
  description: 'Invite the bot to your server!',
  execute(message, args) {
    message.reply(`click here to invite the bot to your own server!
    <https://discordapp.com/api/oauth2/authorize?client_id=693559759080521768&scope=bot&permissions=280640>`);
  }
}