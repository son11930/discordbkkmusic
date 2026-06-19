import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { getPlayer } from '../bot/manager';

export const data = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Make the bot join your current voice channel');

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild || !interaction.guildId) return interaction.reply({ content: '❌ This command can only be used in a server!', ephemeral: true });

  const member = interaction.member as GuildMember;
  const voiceChannel = member?.voice?.channel;
  if (!voiceChannel) {
    return interaction.reply({ content: '❌ You need to be in a voice channel!', ephemeral: true });
  }

  if (voiceChannel.full) {
    return interaction.reply({ content: '❌ ห้องเสียงนี้คนเต็มแล้วครับ บอทเข้าไม่ได้!', ephemeral: true });
  }

  const botMember = interaction.guild!.members.me;
  if (botMember) {
    const permissions = voiceChannel.permissionsFor(botMember);
    if (!permissions.has('Connect')) {
      return interaction.reply('❌ **บอทไม่มีสิทธิ์เข้าห้องนี้ครับ! (Missing Connect Permission)**\\nกรุณาไปตั้งค่าห้องนี้ (Edit Channel -> Permissions) แล้วกดเพิ่มยศบอท และติ๊กถูก ✅ ให้สิทธิ์ `Connect` กับ `View Channel` ด้วยครับ');
    }
    if (!permissions.has('Speak')) {
      return interaction.reply('❌ **บอทไม่มีสิทธิ์ส่งเสียงในห้องนี้ครับ! (Missing Speak Permission)**\\nกรุณาไปตั้งค่าห้องนี้ แล้วติ๊กถูก ✅ ให้สิทธิ์ `Speak` กับบอทด้วยครับ');
    }
  }

  const player = getPlayer(interaction.guildId!);
  player.join(voiceChannel.id, interaction.guildId!, interaction.guild!.voiceAdapterCreator as any);
  
  return interaction.reply('✅ Joined your voice channel!');
}
