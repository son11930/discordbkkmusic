import { describe, it, expect, beforeEach } from 'vitest';
import { MusicQueue, Song } from './queue';

describe('MusicQueue', () => {
  let queue: MusicQueue;

  beforeEach(() => {
    queue = new MusicQueue();
  });

  it('should initialize empty', () => {
    expect(queue.getAll()).toEqual([]);
    expect(queue.current).toBeUndefined();
  });

  it('should add a song to the queue', () => {
    const song: Song = { title: 'Test Song', url: 'http://test.com' };
    const newQueue = queue.add(song);
    
    // Immutability check
    expect(newQueue).not.toBe(queue);
    expect(newQueue.getAll()).toHaveLength(1);
    expect(newQueue.getAll()[0]).toEqual(song);
  });

  it('should skip to next song', () => {
    const song1: Song = { title: 'Song 1', url: 'http://test1.com' };
    const song2: Song = { title: 'Song 2', url: 'http://test2.com' };
    
    let q = queue.add(song1).add(song2);
    
    expect(q.current).toBeUndefined(); // Nothing playing yet
    
    // Start playing (moves first song to current)
    q = q.next();
    expect(q.current).toEqual(song1);
    expect(q.getAll()).toEqual([song2]);
    
    // Skip to next
    q = q.next();
    expect(q.current).toEqual(song2);
    expect(q.getAll()).toEqual([]);
    
    // Skip when empty
    q = q.next();
    expect(q.current).toBeUndefined();
    expect(q.getAll()).toEqual([]);
  });

  it('should clear the queue but keep current song', () => {
    const song1: Song = { title: 'Song 1', url: 'http://test1.com' };
    const song2: Song = { title: 'Song 2', url: 'http://test2.com' };
    
    let q = queue.add(song1).add(song2).next();
    
    expect(q.current).toEqual(song1);
    expect(q.getAll()).toHaveLength(1);
    
    q = q.clear();
    expect(q.current).toEqual(song1);
    expect(q.getAll()).toHaveLength(0);
  });

  it('should initialize with provided items and current song', () => {
    const song1: Song = { title: 'Song 1', url: 'http://test1.com' };
    const song2: Song = { title: 'Song 2', url: 'http://test2.com' };
    const initialQueue = new MusicQueue([song1], song2);
    
    expect(initialQueue.getAll()).toEqual([song1]);
    expect(initialQueue.current).toEqual(song2);
  });

  it('should clear an already empty queue', () => {
    const emptyQueue = new MusicQueue();
    const clearedQueue = emptyQueue.clear();
    
    expect(clearedQueue.getAll()).toEqual([]);
    expect(clearedQueue.current).toBeUndefined();
    expect(clearedQueue).not.toBe(emptyQueue);
  });
});
