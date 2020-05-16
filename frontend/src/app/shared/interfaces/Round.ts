export interface Round {
  id?: number;
  syllable: string;
  dice: 0 | 1 | 2;
  gameId: number;
  ended: boolean;
  currentPartecipantId: number;
};
