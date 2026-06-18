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
  await interaction.deferReply();
  const query = interaction.options.getString('query', true);
  
  const member = interaction.member as GuildMember;
  if (!member?.voice?.channel) {
    return interaction.editReply('❌ You need to be in a voice channel to play music!');
  }

  const player = getPlayer(interaction.guildId!);
  player.join(member.voice.channel.id, interaction.guildId!, interaction.guild!.voiceAdapterCreator as any);

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
