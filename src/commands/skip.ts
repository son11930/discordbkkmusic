import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { getPlayer } from '../bot/manager';

export const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip the current song and play the next one in the queue');

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.member as GuildMember;
  if (!member?.voice?.channel) {
    return interaction.reply({ content: '❌ You need to be in a voice channel!', ephemeral: true });
  }

  const player = getPlayer(interaction.guildId!);
  player.skip();
  return interaction.reply('⏭️ Skipped the current song.');
}
