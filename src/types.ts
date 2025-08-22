export interface Participant {
  tokenNo: string;
  name: string;
  phone: string;
  year: string;
  id: string;
}

export interface Winner {
  participant: Participant;
  rank: string;
  year: string;
  id: string;
  assignedAt: string;
}

export type PrizeRank = '1st Prize' | '2nd Prize' | '3rd Prize' | 'Consolation Prize' | 'Special Prize';