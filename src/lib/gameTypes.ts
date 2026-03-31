export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom';

export interface GameSettings {
  difficulty: Difficulty;
  min: number;
  max: number;
}

export interface GuessEntry {
  value: number;
  result: 'low' | 'high' | 'correct';
}

export interface HighScore {
  difficulty: string;
  range: string;
  attempts: number;
  date: string;
}

export const DIFFICULTY_RANGES: Record<Exclude<Difficulty, 'custom'>, { min: number; max: number }> = {
  easy: { min: 1, max: 50 },
  medium: { min: 1, max: 100 },
  hard: { min: 1, max: 1000 },
};

export function getHighScores(): HighScore[] {
  try {
    return JSON.parse(localStorage.getItem('myNumberIs_highScores') || '[]');
  } catch { return []; }
}

export function saveHighScore(score: HighScore) {
  const scores = getHighScores();
  scores.push(score);
  scores.sort((a, b) => a.attempts - b.attempts);
  localStorage.setItem('myNumberIs_highScores', JSON.stringify(scores.slice(0, 20)));
}
