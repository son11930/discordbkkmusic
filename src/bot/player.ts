import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  DiscordGatewayAdapterCreator,
} from '@discordjs/voice';
import play from 'play-dl';
import { MusicQueue, Song } from '../music/queue';

export class MusicPlayer {
  private player: AudioPlayer;
  private connection: VoiceConnection | null = null;
  private currentQueue: MusicQueue;
  private errorCount = 0;
  private onStopCallback?: () => void;

  constructor(onStop?: () => void) {
    this.player = createAudioPlayer();
    this.currentQueue = new MusicQueue();
    this.onStopCallback = onStop;

    // Event listener for when a song finishes
    this.player.on(AudioPlayerStatus.Idle, () => {
      this.playNext();
    });
  }

  public get queue(): MusicQueue {
    return this.currentQueue;
  }

  public join(
    channelId: string,
    guildId: string,
    adapterCreator: DiscordGatewayAdapterCreator
  ): void {
    this.connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    this.connection.subscribe(this.player);

    this.connection.on(VoiceConnectionStatus.Disconnected, () => {
      this.stop();
    });
  }

  public async addAndPlay(song: Song): Promise<'playing' | 'queued' | 'error'> {
    this.currentQueue = this.currentQueue.add(song);
    
    // If not playing anything, start playing
    if (this.player.state.status !== AudioPlayerStatus.Playing) {
      const success = await this.playNext();
      return success ? 'playing' : 'error';
    }
    return 'queued';
  }

  public async playNext(): Promise<boolean> {
    this.currentQueue = this.currentQueue.next();
    const nextSong = this.currentQueue.current;

    if (!nextSong) {
      this.player.stop();
      return false;
    }

    try {
      const stream = await play.stream(nextSong.url);
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });
      this.player.play(resource);
      this.errorCount = 0; // reset on success
      return true;
    } catch (error) {
      console.error(`Error playing song ${nextSong.url}:`, error);
      this.errorCount++;
      if (this.errorCount >= 3) {
        console.error('Too many consecutive errors, stopping player to prevent infinite loop.');
        this.stop();
        return false;
      }
      // Skip to the next one if it fails
      return this.playNext();
    }
  }

  public pause(): void {
    this.player.pause();
  }

  public resume(): void {
    this.player.unpause();
  }

  public skip(): void {
    this.player.stop(); // This triggers the Idle event, which calls playNext()
  }

  public stop(): void {
    this.currentQueue = this.currentQueue.clear();
    this.player.stop();
    if (this.connection) {
      this.connection.destroy();
      this.connection = null;
    }
    this.onStopCallback?.();
  }
}
