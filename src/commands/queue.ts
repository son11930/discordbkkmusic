import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getPlayer } from '../bot/manager';

export const data = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Show the current music queue');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player = getPlayer(interaction.guildId!);
  const queue = player.queue;
  
  if (!queue.current && queue.getAll().length === 0) {
    return interaction.reply('📭 The queue is currently empty.');
  }

  let replyStr = '';
  if (queue.current) {
    replyStr += `**Currently Playing:**\n🎶 ${queue.current.title}\n\n`;
  }

  const upcoming = queue.getAll();
  if (upcoming.length > 0) {
    replyStr += `**Upcoming:**\n`;
    upcoming.forEach((song, i) => {
      replyStr += `${i + 1}. ${song.title}\n`;
    });
  }

  return interaction.reply({ content: replyStr || 'Queue is empty.', ephemeral: true });
}
