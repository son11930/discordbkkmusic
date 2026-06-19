import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  DiscordGatewayAdapterCreator,
  StreamType,
} from '@discordjs/voice';
import youtubedl, { exec } from 'youtube-dl-exec';
import { ChildProcess } from 'child_process';
import { MusicQueue, Song } from '../music/queue';

export class MusicPlayer {
  private player: AudioPlayer;
  private connection: VoiceConnection | null = null;
  private currentQueue: MusicQueue;
  private errorCount = 0;
  private onStopCallback?: () => void;
  private leaveTimeout: NodeJS.Timeout | null = null;
  private readonly LEAVE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
  private currentProcess: ChildProcess | null = null;

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

    // Start timeout in case they join but never play anything
    this.startLeaveTimeout();
  }

  private startLeaveTimeout(): void {
    this.clearLeaveTimeout();
    this.leaveTimeout = setTimeout(() => {
      console.log('Leaving voice channel due to inactivity.');
      this.stop();
    }, this.LEAVE_TIMEOUT_MS);
  }

  private clearLeaveTimeout(): void {
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout);
      this.leaveTimeout = null;
    }
  }

  public async addAndPlay(song: Song): Promise<'playing' | 'queued' | 'error'> {
    this.clearLeaveTimeout(); // Clear timeout when a new song is added
    this.currentQueue = this.currentQueue.add(song);
    
    // If not playing anything, start playing
    if (this.player.state.status !== AudioPlayerStatus.Playing) {
      const success = await this.playNext();
      return success ? 'playing' : 'error';
    }
    return 'queued';
  }

  public async addNextAndPlay(song: Song): Promise<'playing' | 'queued' | 'error'> {
    this.clearLeaveTimeout();
    this.currentQueue = this.currentQueue.addNext(song);
    
    if (this.player.state.status !== AudioPlayerStatus.Playing) {
      const success = await this.playNext();
      return success ? 'playing' : 'error';
    }
    return 'queued';
  }

  public async playNext(): Promise<boolean> {
    if (this.currentProcess) {
      this.currentProcess.kill();
      this.currentProcess = null;
    }

    this.currentQueue = this.currentQueue.next();
    const nextSong = this.currentQueue.current;

    if (!nextSong) {
      this.player.stop();
      this.startLeaveTimeout(); // Queue is empty, start the timeout
      return false;
    }

    try {
      this.currentProcess = exec(nextSong.url, {
        output: '-',
        quiet: true,
        format: 'bestaudio[ext=webm][acodec=opus]/bestaudio/best',
        limitRate: '1M',
      }, { stdio: ['ignore', 'pipe', 'ignore'] });

      if (!this.currentProcess.stdout) throw new Error("No stdout from yt-dlp");

      const resource = createAudioResource(this.currentProcess.stdout, {
        inputType: StreamType.WebmOpus,
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
    this.clearLeaveTimeout();
    this.currentQueue = this.currentQueue.clear();
    this.player.stop();
    if (this.currentProcess) {
      this.currentProcess.kill();
      this.currentProcess = null;
    }
    if (this.connection) {
      this.connection.destroy();
      this.connection = null;
    }
    this.onStopCallback?.();
  }
}
