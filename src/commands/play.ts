import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { getPlayer } from '../bot/manager';
import youtubedl from 'youtube-dl-exec';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play a song from YouTube or YouTube Music')
  .addStringOption(option =>
    option.setName('query')
      .setDescription('URL or search term')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild || !interaction.guildId) {
    return interaction.reply({ content: '❌ This command can only be used in a server!', ephemeral: true });
  }

  await interaction.deferReply();
  const query = interaction.options.getString('query', true);

  if (query.trim().startsWith('-')) {
    return interaction.editReply('❌ Invalid search query. Commands or flags are not allowed.');
  }
  
  const member = interaction.member as GuildMember;
  const voiceChannel = member?.voice?.channel;
  if (!voiceChannel) {
    return interaction.editReply('❌ You need to be in a voice channel to play music!');
  }

  const botMember = interaction.guild!.members.me;
  if (botMember) {
    const permissions = voiceChannel.permissionsFor(botMember);
    if (!permissions.has('Connect')) {
      return interaction.editReply('❌ **บอทไม่มีสิทธิ์เข้าห้องนี้ครับ! (Missing Connect Permission)**\\nกรุณาไปตั้งค่าห้องนี้ (Edit Channel -> Permissions) แล้วกดเพิ่มยศบอท และติ๊กถูก ✅ ให้สิทธิ์ `Connect` กับ `View Channel` ด้วยครับ');
    }
    if (!permissions.has('Speak')) {
      return interaction.editReply('❌ **บอทไม่มีสิทธิ์ส่งเสียงในห้องนี้ครับ! (Missing Speak Permission)**\\nกรุณาไปตั้งค่าห้องนี้ แล้วติ๊กถูก ✅ ให้สิทธิ์ `Speak` กับบอทด้วยครับ');
    }
  }

  const player = getPlayer(interaction.guildId!);
  player.join(voiceChannel.id, interaction.guildId!, interaction.guild!.voiceAdapterCreator as any);

  try {
    let songInfo;
    let searchQuery = query;

    if (!query.startsWith('http')) {
      searchQuery = `ytsearch1:${query}`;
    }

    try {
      const info = await youtubedl(searchQuery, {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificates: true,
        preferFreeFormats: true,
        skipDownload: true,
        flatPlaylist: true,
        youtubeSkipDashManifest: true
      });

      // If it's a search, info.entries will exist
      const video = (info as any).entries ? (info as any).entries[0] : info;
      if (!video) {
        return interaction.editReply('❌ No results found.');
      }
      
      songInfo = { title: video.title || 'Unknown', url: video.webpage_url || video.url || query };
    } catch (e) {
      console.error('yt-dlp search error:', e);
      return interaction.editReply('❌ Error searching or invalid URL.');
    }

    const result = await player.addAndPlay(songInfo);
    if (result === 'playing') {
      return interaction.editReply(`🎶 Now playing: **${songInfo.title}**`);
    } else if (result === 'queued') {
      return interaction.editReply(`📝 Added to queue: **${songInfo.title}**`);
    } else {
      return interaction.editReply(`❌ Failed to play **${songInfo.title}**. (YouTube might be blocking the server IP)`);
    }
  } catch (error) {
    console.error(error);
    return interaction.editReply('❌ There was an error trying to play that song. It might be age-restricted or unavailable.');
  }
}
