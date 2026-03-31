import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Home, ArrowUp, ArrowDown, Check } from "lucide-react";
import { GameSettings, GuessEntry } from "@/lib/gameTypes";

interface GameScreenProps {
  settings: GameSettings;
  secretNumber: number;
  onWin: (attempts: number) => void;
  onReset: () => void;
  onHome: () => void;
  playerLabel?: string;
}

export default function GameScreen({ settings, secretNumber, onWin, onReset, onHome, playerLabel }: GameScreenProps) {
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState<GuessEntry[]>([]);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const makeGuess = useCallback(() => {
    const num = parseInt(guess);
    if (isNaN(num) || num < settings.min || num > settings.max) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (history.some(h => h.value === num)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    let result: GuessEntry["result"] = num === secretNumber ? "correct" : num < secretNumber ? "low" : "high";
    const newHistory = [...history, { value: num, result }];
    setHistory(newHistory);
    setGuess("");

    if (result === "correct") {
      onWin(newHistory.length);
    }

    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
  }, [guess, history, secretNumber, settings, onWin]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") makeGuess();
  };

  const resultIcon = (r: GuessEntry["result"]) => {
    if (r === "low") return <ArrowUp className="w-4 h-4" />;
    if (r === "high") return <ArrowDown className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  const resultColor = (r: GuessEntry["result"]) => {
    if (r === "low") return "text-guess-low border-guess-low/30 bg-guess-low/10";
    if (r === "high") return "text-guess-high border-guess-high/30 bg-guess-high/10";
    return "text-guess-correct border-guess-correct/30 bg-guess-correct/10";
  };

  const resultText = (r: GuessEntry["result"]) => {
    if (r === "low") return "Too Low ↑";
    if (r === "high") return "Too High ↓";
    return "Correct! 🎉";
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8">
      {/* Top bar */}
      <div className="w-full max-w-lg flex justify-between items-center mb-6">
        <button onClick={onHome} className="text-muted-foreground hover:text-foreground transition-colors">
          <Home className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          {playerLabel && (
            <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary font-display text-xs font-bold">
              {playerLabel}
            </span>
          )}
          <div className="font-display text-sm neon-text-cyan">
            Attempts: {history.length}
          </div>
        </div>
        {!playerLabel ? (
          <button onClick={onReset} className="text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
        ) : <div className="w-5" />}
      </div>

      {/* Range display */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel px-6 py-4 mb-8 text-center w-full max-w-lg"
      >
        <p className="text-muted-foreground font-body text-sm">I'm thinking of a number between</p>
        <p className="font-display text-2xl font-bold mt-1">
          <span className="neon-text-pink">{settings.min}</span>
          <span className="text-muted-foreground mx-2">and</span>
          <span className="neon-text-pink">{settings.max}</span>
        </p>
      </motion.div>

      {/* Input area */}
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg flex gap-3 mb-8"
      >
        <input
          ref={inputRef}
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your guess..."
          className="flex-1 px-6 py-4 rounded-xl bg-input border-2 border-border text-foreground font-display text-xl text-center focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
          min={settings.min}
          max={settings.max}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={makeGuess}
          className="px-8 py-4 rounded-xl font-display font-bold bg-primary text-primary-foreground neon-glow-cyan text-lg"
        >
          Guess!
        </motion.button>
      </motion.div>

      {/* History */}
      <div ref={listRef} className="w-full max-w-lg flex-1 overflow-y-auto max-h-[40vh] space-y-2 pr-1">
        <AnimatePresence>
          {history.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border font-body ${resultColor(entry.result)}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm font-display">#{i + 1}</span>
                <span className="font-bold text-lg font-display">{entry.value}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                {resultIcon(entry.result)}
                {resultText(entry.result)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {history.length === 0 && (
          <p className="text-center text-muted-foreground/50 font-body py-8">
            Your guesses will appear here...
          </p>
        )}
      </div>
    </div>
  );
}
