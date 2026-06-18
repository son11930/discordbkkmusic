import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getPlayer } from '../bot/manager';

export const data = new SlashCommandBuilder()
  .setName('pause')
  .setDescription('Pause or resume the current song');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player = getPlayer(interaction.guildId!);
  
  // Note: For a robust implementation we might track play state.
  // For now, pause/resume commands are simple proxies.
  // To avoid adding state, we just expose pause and another command for resume.
  // We'll pause here.
  player.pause();
  return interaction.reply('⏸️ Paused the music.');
}
