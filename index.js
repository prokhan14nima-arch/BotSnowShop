const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const prefix = "!";
const warns = new Map();

client.once("ready", () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  const member = message.mentions.members.first();

  if (cmd === "ban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("❌ دسترسی بن نداری");
    if (!member) return message.reply("❌ یوزر رو منشن کن");
    await member.ban();
    message.channel.send(`🔨 ${member.user.tag} بن شد`);
  }

  if (cmd === "kick") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply("❌ دسترسی کیک نداری");
    if (!member) return message.reply("❌ یوزر رو منشن کن");
    await member.kick();
    message.channel.send(`👢 ${member.user.tag} کیک شد`);
  }

  if (cmd === "mute") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return message.reply("❌ دسترسی میوت نداری");
    if (!member) return message.reply("❌ یوزر رو منشن کن");
    await member.timeout(10 * 60 * 1000);
    message.channel.send(`🔇 ${member.user.tag} میوت شد`);
  }

  if (cmd === "warn") {
    if (!member) return message.reply("❌ یوزر رو منشن کن");
    const count = warns.get(member.id) || 0;
    warns.set(member.id, count + 1);
    message.channel.send(`⚠️ ${member.user.tag} اخطار گرفت (${count + 1})`);
  }

  if (cmd === "clear") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply("❌ دسترسی نداری");
    const amount = parseInt(args[0]);
    if (!amount) return message.reply("❌ عدد بده");
    await message.channel.bulkDelete(amount, true);
    message.channel.send(`🧹 ${amount} پیام پاک شد`);
  }
});

client.login(process.env.DISCORD_TOKEN);
