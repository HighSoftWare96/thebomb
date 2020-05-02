export interface Game {
  id?: number;
  roomId: number;
  currentRounds?: number;
  currentRoundId?: number;
  rounds: number;
  minTimeS: number;
  maxTimeS: number;
  language: string;
  difficulty: number;
}