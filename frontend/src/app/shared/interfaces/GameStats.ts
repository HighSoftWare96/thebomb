import { Partecipant } from './Partecipant';

export interface PartecipantStats extends Partecipant {
  lostRounds: number;
}

export type GameStats = PartecipantStats[];