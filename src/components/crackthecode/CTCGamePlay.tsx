import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import NumberPad from "./NumberPad";
import CodeDisplay from "./CodeDisplay";
import GuessHistory from "./GuessHistory";
import ReactionPopup from "./ReactionPopup";
import CTCWinScreen from "./CTCWinScreen";
import { CTCGuess, checkGuess, getReaction, saveCTCBestScore } from "@/lib/crackTheCode";

interface CTCGamePlayProps {
  secretCode: number[];
  codeLength: number;
  playerName?: string;
  onHome: () => void;
  onPlayAgain: () => void;
}

export default function CTCGamePlay({ secretCode, codeLength, playerName, onHome, onPlayAgain }: CTCGamePlayProps) {
  const [currentDigits, setCurrentDigits] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<CTCGuess[]>([]);
  const [reaction, setReaction] = useState<string | null>(null);
  const [lastCorrect, setLastCorrect] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);

  const handleDigit = useCallback((d: number) => {
    setCurrentDigits(prev => prev.length < codeLength ? [...prev, d] : prev);
  }, [codeLength]);

  const handleDelete = useCallback(() => {
    setCurrentDigits(prev => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(() => {
    if (currentDigits.length !== codeLength) return;

    const correctPositions = checkGuess(currentDigits, secretCode);
    const newGuess: CTCGuess = { digits: [...currentDigits], correctPositions };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setLastCorrect(correctPositions);
    setCurrentDigits([]);

    // Show reaction
    const r = getReaction(correctPositions.length, codeLength);
    setReaction(r);
    setTimeout(() => setReaction(null), 1500);

    if (correctPositions.length === codeLength) {
      setSolved(true);
      saveCTCBestScore(`solo-${codeLength}`, newGuesses.length);
    }
  }, [currentDigits, codeLength, secretCode, guesses]);

  if (solved) {
    return (
      <CTCWinScreen
        attempts={guesses.length}
        code={secretCode}
        playerName={playerName}
        onPlayAgain={onPlayAgain}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      <ReactionPopup text={reaction} />

      {/* Top bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <button onClick={onHome} className="text-muted-foreground hover:text-foreground transition-colors">
          <Home className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          {playerName && (
            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-display text-xs font-bold">
              {playerName}
            </span>
          )}
          <span className="font-display text-sm" style={{ color: "hsl(320, 100%, 70%)" }}>
            Attempts: {guesses.length}
          </span>
        </div>
        <div className="w-5" />
      </div>

      {/* Emoji feedback */}
      <motion.div
        key={guesses.length}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-4xl mb-3"
      >
        {guesses.length === 0 ? "🤔" : lastCorrect.length === 0 ? "😬" : lastCorrect.length >= codeLength - 1 ? "🤯" : "😏"}
      </motion.div>

      {/* Code display */}
      <div className="mb-6">
        <CodeDisplay digits={currentDigits} codeLength={codeLength} correctPositions={[]} />
      </div>

      {/* Number pad */}
      <div className="mb-6">
        <NumberPad
          onDigit={handleDigit}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          canSubmit={currentDigits.length === codeLength}
        />
      </div>

      {/* History */}
      <div className="w-full max-w-md flex-1">
        <GuessHistory guesses={guesses} codeLength={codeLength} />
      </div>
    </div>
  );
}
