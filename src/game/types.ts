export type Category = 'landmark' | 'city' | 'nature';

export interface Target {
  id: string;
  title: string;
  category: Category;
  lon: number;
  lat: number;
  /** Clicking within this many km of the target wins. */
  winRadiusKm: number;
  /** Ordered vague -> specific. One is revealed per guess. */
  hints: string[];
  /** Shown on the result card. */
  fact: string;
}

export type MapMode = 'easy' | 'hard' | 'random';

export interface Guess {
  lon: number;
  lat: number;
  distanceKm: number;
  bearingDeg: number;
  radiusKm: number;
  /** Target lies inside this guess's circle (green). */
  hit: boolean;
  /** This guess ended the game as a win. */
  win: boolean;
}

export type Status = 'playing' | 'won' | 'lost';

export interface GameState {
  target: Target;
  guesses: Guess[];
  /** Radius of the smallest green circle so far, km. */
  greenRadiusKm: number | null;
  greenCenter: [number, number] | null;
  status: Status;
  hintsRevealed: number;
}
