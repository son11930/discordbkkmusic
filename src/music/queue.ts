export interface Song {
  title: string;
  url: string;
}

export class MusicQueue {
  private readonly items: Song[];
  public readonly current: Song | undefined;

  constructor(items: Song[] = [], current?: Song) {
    this.items = [...items];
    this.current = current;
  }

  /**
   * Adds a song to the end of the queue.
   * Returns a NEW instance of MusicQueue.
   */
  public add(song: Song): MusicQueue {
    return new MusicQueue([...this.items, song], this.current);
  }

  /**
   * Skips to the next song in the queue.
   * Returns a NEW instance of MusicQueue.
   */
  public next(): MusicQueue {
    if (this.items.length === 0) {
      return new MusicQueue([], undefined);
    }
    const [nextSong, ...rest] = this.items;
    return new MusicQueue(rest, nextSong);
  }

  /**
   * Clears all songs from the queue.
   * Returns a NEW instance of MusicQueue.
   */
  public clear(): MusicQueue {
    return new MusicQueue([], this.current);
  }

  /**
   * Gets all upcoming songs in the queue.
   */
  public getAll(): Song[] {
    return [...this.items];
  }
}
