import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { getPlayer } from '../bot/manager';

export const data = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Make the bot join your current voice channel');

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.member as GuildMember;
  if (!member?.voice?.channel) {
    return interaction.reply({ content: '❌ You need to be in a voice channel!', ephemeral: true });
  }

  const player = getPlayer(interaction.guildId!);
  player.join(member.voice.channel.id, interaction.guildId!, interaction.guild!.voiceAdapterCreator as any);
  
  return interaction.reply('✅ Joined your voice channel!');
}
