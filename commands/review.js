// commands/review.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('review')
    .setDescription('Leave a review for the server!'),

  async execute(client, interaction, config) {
    if (config.clientRoles.enabled && !interaction.member.roles.cache.has(config.clientRoles.clienRole)) {
      return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
    }
    client.openhandesomemodal(interaction);
  }
};
