import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import NumberPad from "./NumberPad";
import CodeDisplay from "./CodeDisplay";
import GuessHistory from "./GuessHistory";
import ReactionPopup from "./ReactionPopup";
import CTCWinScreen from "./CTCWinScreen";
import { CTCGuess, checkGuess, getReaction } from "@/lib/crackTheCode";

interface CTCMultiplayerGameProps {
  p1Name: string;
  p2Name: string;
  p1Code: number[];
  p2Code: number[];
  codeLength: number;
  onHome: () => void;
  onPlayAgain: () => void;
}

export default function CTCMultiplayerGame({
  p1Name, p2Name, p1Code, p2Code, codeLength, onHome, onPlayAgain,
}: CTCMultiplayerGameProps) {
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [p1Guesses, setP1Guesses] = useState<CTCGuess[]>([]);
  const [p2Guesses, setP2Guesses] = useState<CTCGuess[]>([]);
  const [currentDigits, setCurrentDigits] = useState<number[]>([]);
  const [reaction, setReaction] = useState<string | null>(null);
  const [lastCorrect, setLastCorrect] = useState<number[]>([]);
  const [winner, setWinner] = useState<1 | 2 | null>(null);

  const currentName = currentPlayer === 1 ? p1Name : p2Name;
  // P1 guesses P2's code, P2 guesses P1's code
  const currentTarget = currentPlayer === 1 ? p2Code : p1Code;
  const currentGuesses = currentPlayer === 1 ? p1Guesses : p2Guesses;

  const handleDigit = useCallback((d: number) => {
    setCurrentDigits(prev => prev.length < codeLength ? [...prev, d] : prev);
  }, [codeLength]);

  const handleDelete = useCallback(() => {
    setCurrentDigits(prev => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(() => {
    if (currentDigits.length !== codeLength) return;

    const correctPositions = checkGuess(currentDigits, currentTarget);
    const newGuess: CTCGuess = { digits: [...currentDigits], correctPositions };

    const r = getReaction(correctPositions.length, codeLength);
    setReaction(r);
    setTimeout(() => setReaction(null), 1500);
    setLastCorrect(correctPositions);
    setCurrentDigits([]);

    if (currentPlayer === 1) {
      const updated = [...p1Guesses, newGuess];
      setP1Guesses(updated);
      if (correctPositions.length === codeLength) {
        setWinner(1);
        return;
      }
    } else {
      const updated = [...p2Guesses, newGuess];
      setP2Guesses(updated);
      if (correctPositions.length === codeLength) {
        setWinner(2);
        return;
      }
    }

    setCurrentPlayer(p => p === 1 ? 2 : 1);
  }, [currentDigits, codeLength, currentTarget, currentPlayer, p1Guesses, p2Guesses]);

  if (winner) {
    const winnerName = winner === 1 ? p1Name : p2Name;
    const attempts = winner === 1 ? p1Guesses.length : p2Guesses.length;
    return (
      <CTCWinScreen
        attempts={attempts}
        code={winner === 1 ? p2Code : p1Code}
        playerName={winnerName}
        onPlayAgain={onPlayAgain}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      <ReactionPopup text={reaction} />

      {/* Top bar */}
      <div className="w-full max-w-lg flex justify-between items-center mb-3">
        <button onClick={onHome} className="text-muted-foreground hover:text-foreground transition-colors">
          <Home className="w-5 h-5" />
        </button>
        <div className="font-display text-xs text-muted-foreground">
          {codeLength}-digit code
        </div>
        <div className="w-5" />
      </div>

      {/* Current turn indicator */}
      <motion.div
        key={currentPlayer}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/30"
      >
        <span className="font-display text-sm font-bold" style={{ color: "hsl(320, 100%, 70%)" }}>{currentName}</span>
        <span className="text-muted-foreground font-body text-sm ml-1">— your turn!</span>
      </motion.div>

      {/* Emoji feedback */}
      <motion.div
        key={`${currentPlayer}-${currentGuesses.length}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-3xl mb-2"
      >
        {currentGuesses.length === 0 ? "🤔" : lastCorrect.length === 0 ? "😬" : lastCorrect.length >= codeLength - 1 ? "🤯" : "😏"}
      </motion.div>

      {/* Code display */}
      <div className="mb-4">
        <CodeDisplay digits={currentDigits} codeLength={codeLength} correctPositions={[]} />
      </div>

      {/* Number pad */}
      <div className="mb-4">
        <NumberPad
          onDigit={handleDigit}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          canSubmit={currentDigits.length === codeLength}
        />
      </div>

      {/* Side-by-side history */}
      <div className="w-full max-w-lg flex gap-3 flex-1">
        <div className={`flex-1 flex flex-col min-w-0 rounded-xl border p-3 transition-all ${currentPlayer === 1 ? "border-accent/50 bg-accent/5" : "border-border bg-muted/10"}`}>
          <div className="text-center mb-2">
            <div className={`font-display text-sm font-bold truncate ${currentPlayer === 1 ? "text-accent" : "text-muted-foreground"}`}>
              {p1Name}
            </div>
            <div className="text-xs text-muted-foreground/60 font-body">
              {p1Guesses.length} guesses
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[25vh]">
            <GuessHistory guesses={p1Guesses} codeLength={codeLength} compact />
          </div>
        </div>
        <div className={`flex-1 flex flex-col min-w-0 rounded-xl border p-3 transition-all ${currentPlayer === 2 ? "border-accent/50 bg-accent/5" : "border-border bg-muted/10"}`}>
          <div className="text-center mb-2">
            <div className={`font-display text-sm font-bold truncate ${currentPlayer === 2 ? "text-accent" : "text-muted-foreground"}`}>
              {p2Name}
            </div>
            <div className="text-xs text-muted-foreground/60 font-body">
              {p2Guesses.length} guesses
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[25vh]">
            <GuessHistory guesses={p2Guesses} codeLength={codeLength} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
