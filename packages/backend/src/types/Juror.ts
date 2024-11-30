export interface Vote {
  name: string;
  score: number;
}

export interface Juror {
  name: string;
  votes?: Vote[];
}
