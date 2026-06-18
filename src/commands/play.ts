import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { getPlayer } from '../bot/manager';
import play from 'play-dl';

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
    let titleToSearch = query;

    if (query.startsWith('http')) {
      try {
        const urlObj = new URL(query);
        const validHostnames = ['youtube.com', 'www.youtube.com', 'youtu.be', 'music.youtube.com'];
        if (!validHostnames.includes(urlObj.hostname)) {
          return interaction.editReply('❌ Only YouTube URLs are supported right now.');
        }
        const info = await play.video_info(query);
        titleToSearch = info.video_details.title || 'Unknown';
      } catch {
        return interaction.editReply('❌ Invalid URL provided or YouTube blocked fetching info.');
      }
    }

    // Search on SoundCloud with the query (or the extracted YouTube title)
    try {
      const searchResults = await play.search(titleToSearch, { limit: 1, source: { soundcloud: 'tracks' } });
      if (searchResults.length === 0) {
        return interaction.editReply('❌ No results found on SoundCloud.');
      }
      songInfo = { title: searchResults[0].name || searchResults[0].title || 'Unknown', url: searchResults[0].url };
    } catch (e) {
      console.error('SoundCloud search error:', e);
      return interaction.editReply('❌ Error searching on SoundCloud.');
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
