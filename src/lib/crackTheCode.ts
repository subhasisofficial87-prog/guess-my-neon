export interface CTCGuess {
  digits: number[];
  correctPositions: number[]; // indices that are correct
}

export interface CTCGameState {
  secretCode: number[];
  codeLength: number;
  guesses: CTCGuess[];
  solved: boolean;
  startTime: number;
}

export function generateCode(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 10));
}

export function checkGuess(guess: number[], secret: number[]): number[] {
  const correct: number[] = [];
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) correct.push(i);
  }
  return correct;
}

export function formatFeedback(correctPositions: number[], codeLength: number): string {
  if (correctPositions.length === 0) return "None correct 😬";
  if (correctPositions.length === codeLength) return "ALL CORRECT! 🎉🔥";

  const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

  // Check for consecutive from end
  const allFromEnd = (positions: number[]) => {
    const sorted = [...positions].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[sorted.length - 1 - i] !== codeLength - 1 - i) return false;
    }
    return true;
  };

  if (correctPositions.length === 1) {
    return `The ${ordinals[correctPositions[0]]} digit is correct ✅`;
  }

  if (allFromEnd(correctPositions) && correctPositions.length >= 2) {
    return `The last ${correctPositions.length} digits are correct 🔥`;
  }

  const names = correctPositions.map(i => ordinals[i]);
  if (names.length === 2) {
    return `The ${names[0]} and ${names[1]} digits are correct ✅✅`;
  }

  const last = names.pop();
  return `The ${names.join(", ")}, and ${last} digits are correct ${"✅".repeat(correctPositions.length)}`;
}

const REACTIONS_NONE = ["OH NO! 💀", "Not even close! 😭", "Bruh... 😐", "Try harder! 💪"];
const REACTIONS_SOME = ["Getting warmer! 🔥", "OH MY GOD! 😱", "EEEEHHHHH 🔥", "So close yet so far! 😤"];
const REACTIONS_MOST = ["ALMOST THERE! 🤯", "You're done bro! 🔥", "NO WAY! 😱", "ONE MORE! 💀"];
const REACTIONS_WIN = ["CODE CRACKED! 🎉🔥", "GENIUS! 🧠✨", "YOU DID IT! 💪❤️", "UNSTOPPABLE! 🔥🔥🔥"];

export function getReaction(correctCount: number, codeLength: number): string {
  if (correctCount === codeLength) {
    return REACTIONS_WIN[Math.floor(Math.random() * REACTIONS_WIN.length)];
  }
  if (correctCount === 0) {
    return REACTIONS_NONE[Math.floor(Math.random() * REACTIONS_NONE.length)];
  }
  if (correctCount >= codeLength - 1) {
    return REACTIONS_MOST[Math.floor(Math.random() * REACTIONS_MOST.length)];
  }
  return REACTIONS_SOME[Math.floor(Math.random() * REACTIONS_SOME.length)];
}

export function getCTCBestScore(mode: string): number | null {
  try {
    const scores = JSON.parse(localStorage.getItem("ctc_bestScores") || "{}");
    return scores[mode] ?? null;
  } catch { return null; }
}

export function saveCTCBestScore(mode: string, attempts: number) {
  try {
    const scores = JSON.parse(localStorage.getItem("ctc_bestScores") || "{}");
    if (!scores[mode] || attempts < scores[mode]) {
      scores[mode] = attempts;
      localStorage.setItem("ctc_bestScores", JSON.stringify(scores));
    }
  } catch {}
}
