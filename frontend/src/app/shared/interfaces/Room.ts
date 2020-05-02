export interface Room {
  id?: number;
  name: string;
  adminPartecipantId?: number;
  partecipantIds?: number[];
  socketioRoom?: string;
  currentGameId?: number;
  playedGameIds?: number[];
  locked?: boolean;
  maxPartecipants: number;
  inviteId?: string;
}
