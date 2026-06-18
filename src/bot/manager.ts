import { MusicPlayer } from './player';

export const players = new Map<string, MusicPlayer>();

export function getPlayer(guildId: string): MusicPlayer {
  let player = players.get(guildId);
  if (!player) {
    player = new MusicPlayer();
    players.set(guildId, player);
  }
  return player;
}
