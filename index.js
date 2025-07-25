// index.js
const { Client, Collection, Events, ModalBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ButtonBuilder, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const config = require('./config.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

client.commands = new Collection();

client.once(Events.ClientReady, () => {
  const commandsArray = [];
  const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      commandsArray.push(command.data.toJSON());
      console.log(chalk.green(`[COMMAND] Loaded ${command.data.name}`));
    } else {
      console.warn(chalk.yellow(`[COMMAND] Skipped ${file}, missing data or execute`));
    }
  }

  client.application.commands.set(commandsArray)
    .then(() => console.log(chalk.green('[SUCCESS] Commands registered.')))
    .catch(console.error);

  console.log(chalk.green(`[SUCCESS] ${client.user.tag} is now online!`));
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton()) {
    if (interaction.customId.toLowerCase() === 'natreview') {
      if (config.clientRoles.enabled && !interaction.member.roles.cache.has(config.clientRoles.clienRole)) {
        return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
      }
      return client.openhandesomemodal(interaction);
    }
  }

  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(client, interaction, config);
    } catch (e) {
      console.error(chalk.red(`[ERROR] ${e}`));
      interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }

  if (interaction.isModalSubmit() && interaction.customId === 'nat2k15developmetntrateiscoolfr') {
    const rate = interaction.fields.getTextInputValue(`natreview-${interaction.member.id}-rate`);
    const feedback = interaction.fields.getTextInputValue(`natreview-${interaction.member.id}-feedback`);
    const imageInput = interaction.fields.getTextInputValue(`natreview-${interaction.member.id}-image`);
    const imageUrl = imageInput || null;

    if (isNaN(rate)) return interaction.reply({ content: 'The service rating must be a number!', ephemeral: true });
    if (rate < 1 || rate > 5) return interaction.reply({ content: 'The service rating must be between 1-5!', ephemeral: true });

    const starRating = '⭐'.repeat(rate);
    const embed = new EmbedBuilder()
      .setColor(config.embed.color)
      .setFooter({ text: config.embed.footer })
      .setTimestamp()
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setThumbnail(interaction.member.user.displayAvatarURL({ dynamic: true }))
      .setTitle('New Service Review')
      .setDescription(feedback)
      .addFields(
        { name: 'Service Rating', value: `${starRating} (${rate}/5)`, inline: true },
        { name: 'Reviewed by', value: `${interaction.member.user.tag} – ${interaction.member.id}`, inline: true }
      );

    if (imageUrl && /\.(jpeg|jpg|gif|png|webp)$/i.test(imageUrl)) {
      embed.setImage(imageUrl);
    }

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('natreview').setLabel('Submit A Review').setStyle(ButtonStyle.Primary)
    );

    const reviewCh = interaction.guild.channels.cache.get(config.reviewChannel);
    if (!reviewCh) return interaction.reply({ content: 'Review channel not found!', ephemeral: true });
    await reviewCh.send({ embeds: [embed], components: [buttonRow] });
    await interaction.reply({ content: 'Your review has been submitted!', ephemeral: true });

    const logCh = interaction.guild.channels.cache.get(config.loggingChannel);
    if (logCh) {
      logCh.send({ content: `**${interaction.member}** submitted a review!`, embeds: [embed] });
    }
  }
});

client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;
  if (message.channel.id !== config.reviewChannel) return;

  let content = message.content.trim();
  let rating = null;
  let feedback = content;
  const m = content.match(/^([1-5])\s*[:\-]\s*(.+)$/);
  if (m) {
    rating = parseInt(m[1], 10);
    feedback = m[2];
  }

  const starRating = rating ? '⭐'.repeat(rating) + ` (${rating}/5)` : 'No rating provided';
  let img = null;
  const um = feedback.match(/(https?:\/\/\S+\.(?:jpg|jpeg|png|gif|webp))$/i);
  if (um) {
    img = um[1];
    feedback = feedback.slice(0, feedback.length - img.length).trim();
  }

  const embedMsg = new EmbedBuilder()
    .setColor(config.embed.color)
    .setFooter({ text: config.embed.footer })
    .setTimestamp()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
    .setTitle('New Service Review')
    .setDescription(feedback)
    .addFields(
      { name: 'Service Rating', value: starRating, inline: true },
      { name: 'Reviewed by', value: `${message.member.user.tag} – ${message.member.id}`, inline: true }
    );

  if (img) embedMsg.setImage(img);

  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('natreview').setLabel('Submit A Review').setStyle(ButtonStyle.Primary)
  );

  await message.channel.send({ embeds: [embedMsg], components: [buttonRow] });
  await message.delete().catch(() => {});
  message.author.send(`Thanks for your review in **${message.guild.name}**!`).catch(() => {});

  const logCh = message.guild.channels.cache.get(config.loggingChannel);
  if (logCh) logCh.send({ content: `💡 **${message.member}** submitted a review:`, embeds: [embedMsg] });
});

client.openhandesomemodal = async function(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('nat2k15developmetntrateiscoolfr')
    .setTitle(`${interaction.guild.name} - Reviews`);

  const rateInput = new TextInputBuilder()
    .setCustomId(`natreview-${interaction.member.id}-rate`)
    .setLabel('Rate the service 1-5')
    .setPlaceholder('1-5')
    .setMinLength(1)
    .setMaxLength(1)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const feedbackInput = new TextInputBuilder()
    .setCustomId(`natreview-${interaction.member.id}-feedback`)
    .setLabel('Feedback')
    .setPlaceholder('Your feedback here')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(5)
    .setMaxLength(2000)
    .setRequired(true);

  const imageInput = new TextInputBuilder()
    .setCustomId(`natreview-${interaction.member.id}-image`)
    .setLabel('Image (optional)')
    .setPlaceholder('Image URL')
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  modal.addComponents(
    new ActionRowBuilder().addComponents(rateInput),
    new ActionRowBuilder().addComponents(feedbackInput),
    new ActionRowBuilder().addComponents(imageInput)
  );

  await interaction.showModal(modal);
};

client.login(config.token).catch(e => {
  console.error(chalk.red(`[ERROR] Invalid token: ${e}`));
  process.exit(1);
});
