import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ArrowUp, ArrowDown, Check } from "lucide-react";
import { GameSettings, GuessEntry } from "@/lib/gameTypes";

interface MultiplayerGameScreenProps {
  settings: GameSettings;
  secretNumber: number;
  p1Name: string;
  p2Name: string;
  firstPlayer: 1 | 2;
  p1Wins: number;
  p2Wins: number;
  onWin: (winner: 1 | 2, p1Guesses: GuessEntry[], p2Guesses: GuessEntry[]) => void;
  onHome: () => void;
}

export default function MultiplayerGameScreen({
  settings, secretNumber, p1Name, p2Name, firstPlayer, p1Wins, p2Wins, onWin, onHome,
}: MultiplayerGameScreenProps) {
  const [guess, setGuess] = useState("");
  const [p1History, setP1History] = useState<GuessEntry[]>([]);
  const [p2History, setP2History] = useState<GuessEntry[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(firstPlayer);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const p1ListRef = useRef<HTMLDivElement>(null);
  const p2ListRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [currentPlayer]);

  const currentName = currentPlayer === 1 ? p1Name : p2Name;
  const currentHistory = currentPlayer === 1 ? p1History : p2History;

  const makeGuess = useCallback(() => {
    const num = parseInt(guess);
    if (isNaN(num) || num < settings.min || num > settings.max) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    // Check duplicates in current player's history
    if (currentHistory.some(h => h.value === num)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const result: GuessEntry["result"] = num === secretNumber ? "correct" : num < secretNumber ? "low" : "high";
    const entry: GuessEntry = { value: num, result };

    if (currentPlayer === 1) {
      const newH = [...p1History, entry];
      setP1History(newH);
      if (result === "correct") {
        onWin(1, newH, p2History);
        return;
      }
      setCurrentPlayer(2);
    } else {
      const newH = [...p2History, entry];
      setP2History(newH);
      if (result === "correct") {
        onWin(2, p1History, newH);
        return;
      }
      setCurrentPlayer(1);
    }
    setGuess("");

    setTimeout(() => {
      p1ListRef.current?.scrollTo({ top: p1ListRef.current.scrollHeight, behavior: "smooth" });
      p2ListRef.current?.scrollTo({ top: p2ListRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, [guess, currentHistory, p1History, p2History, secretNumber, settings, currentPlayer, onWin]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") makeGuess();
  };

  const resultIcon = (r: GuessEntry["result"]) => {
    if (r === "low") return <ArrowUp className="w-3.5 h-3.5" />;
    if (r === "high") return <ArrowDown className="w-3.5 h-3.5" />;
    return <Check className="w-3.5 h-3.5" />;
  };

  const resultColor = (r: GuessEntry["result"]) => {
    if (r === "low") return "text-guess-low border-guess-low/30 bg-guess-low/10";
    if (r === "high") return "text-guess-high border-guess-high/30 bg-guess-high/10";
    return "text-guess-correct border-guess-correct/30 bg-guess-correct/10";
  };

  const renderColumn = (name: string, history: GuessEntry[], isActive: boolean, wins: number, ref: React.RefObject<HTMLDivElement>) => (
    <div className={`flex-1 flex flex-col min-w-0 rounded-xl border p-3 transition-all ${isActive ? "border-primary/50 bg-primary/5" : "border-border bg-muted/10"}`}>
      <div className="text-center mb-2">
        <div className={`font-display text-sm font-bold truncate ${isActive ? "neon-text-cyan" : "text-muted-foreground"}`}>
          {name}
        </div>
        <div className="text-xs text-muted-foreground/60 font-body">
          🏆 {wins} wins
        </div>
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto max-h-[35vh] space-y-1.5 pr-0.5">
        <AnimatePresence>
          {history.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg border text-xs font-body ${resultColor(entry.result)}`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-display text-[10px]">#{i + 1}</span>
                <span className="font-bold font-display text-sm">{entry.value}</span>
              </div>
              {resultIcon(entry.result)}
            </motion.div>
          ))}
        </AnimatePresence>
        {history.length === 0 && (
          <p className="text-center text-muted-foreground/30 font-body text-xs py-4">No guesses yet</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      {/* Top bar */}
      <div className="w-full max-w-lg flex justify-between items-center mb-4">
        <button onClick={onHome} className="text-muted-foreground hover:text-foreground transition-colors">
          <Home className="w-5 h-5" />
        </button>
        <div className="font-display text-xs text-muted-foreground">
          {settings.min} – {settings.max}
        </div>
        <div className="w-5" />
      </div>

      {/* Range */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel px-5 py-3 mb-4 text-center w-full max-w-lg"
      >
        <p className="text-muted-foreground font-body text-sm">Guess the number between</p>
        <p className="font-display text-xl font-bold mt-0.5">
          <span className="neon-text-pink">{settings.min}</span>
          <span className="text-muted-foreground mx-2">and</span>
          <span className="neon-text-pink">{settings.max}</span>
        </p>
      </motion.div>

      {/* Current turn indicator */}
      <motion.div
        key={currentPlayer}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
      >
        <span className="font-display text-sm font-bold neon-text-cyan">{currentName}</span>
        <span className="text-muted-foreground font-body text-sm ml-1">— your turn!</span>
      </motion.div>

      {/* Input */}
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg flex gap-3 mb-5"
      >
        <input
          ref={inputRef}
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Your guess..."
          className="flex-1 px-5 py-3.5 rounded-xl bg-input border-2 border-border text-foreground font-display text-lg text-center focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
          min={settings.min}
          max={settings.max}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={makeGuess}
          className="px-6 py-3.5 rounded-xl font-display font-bold bg-primary text-primary-foreground neon-glow-cyan text-base"
        >
          Guess!
        </motion.button>
      </motion.div>

      {/* Two columns */}
      <div className="w-full max-w-lg flex gap-3 flex-1">
        {renderColumn(p1Name, p1History, currentPlayer === 1, p1Wins, p1ListRef)}
        {renderColumn(p2Name, p2History, currentPlayer === 2, p2Wins, p2ListRef)}
      </div>
    </div>
  );
}
