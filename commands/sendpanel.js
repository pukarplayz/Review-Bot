// commands/sendpanel.js
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendpanel')
    .setDescription('Send the panel to a channel!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction, config) {
    const embed = new EmbedBuilder()
      .setColor(config.embed.color)
      .setAuthor({ name: `${interaction.guild.name} – Review`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription(
        `Click the **Submit A Review** button below or use the \`/review\` command.\n` +
        `Fill in your feedback, give a rating from 1–5, and optionally include an image!`
      )
      .setFooter({ text: config.embed.footer })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('natreview').setLabel('Submit A Review').setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
  }
};
