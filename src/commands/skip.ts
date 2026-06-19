import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { getPlayer } from '../bot/manager';

export const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip the current song and play the next one in the queue');

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild || !interaction.guildId) return interaction.reply({ content: '❌ This command can only be used in a server!', ephemeral: true });

  const member = interaction.member as GuildMember;
  if (!member?.voice?.channel) {
    return interaction.reply({ content: '❌ You need to be in a voice channel!', ephemeral: true });
  }

  const botMember = interaction.guild.members.me;
  if (botMember?.voice?.channelId && botMember.voice.channelId !== member.voice.channelId) {
    return interaction.reply({ content: '❌ You must be in the same voice channel as the bot!', ephemeral: true });
  }

  const player = getPlayer(interaction.guildId);
  player.skip();
  return interaction.reply('⏭️ Skipped the current song.');
}
