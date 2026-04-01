import { useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Home, Crown, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { GuessEntry } from "@/lib/gameTypes";

interface MultiplayerResultsProps {
  winnerName: string;
  loserName: string;
  winnerAttempts: number;
  loserAttempts: number;
  secretNumber: number;
  winnerWins: number;
  loserWins: number;
  onRematch: () => void;
  onHome: () => void;
}

export default function MultiplayerResults({
  winnerName, loserName, winnerAttempts, loserAttempts, secretNumber,
  winnerWins, loserWins, onRematch, onHome,
}: MultiplayerResultsProps) {
  useEffect(() => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ["#00ffff", "#ff69b4", "#00ff88"] });
    const t = setTimeout(() => confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } }), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="glass-panel neon-border p-8 md:p-10 text-center max-w-md w-full"
      >
        <Crown className="w-14 h-14 mx-auto mb-3 text-neon-pink" />

        <h2 className="font-display text-3xl md:text-4xl font-black mb-1">
          <span className="neon-text-green">{winnerName} Wins!</span>
        </h2>
        <p className="text-muted-foreground font-body mb-2">
          The number was <span className="neon-text-cyan font-display font-bold">{secretNumber}</span>
        </p>
        <p className="text-muted-foreground/60 font-body text-sm mb-6">
          Guessed correctly in {winnerAttempts} {winnerAttempts === 1 ? "attempt" : "attempts"}!
        </p>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { name: winnerName, attempts: winnerAttempts, wins: winnerWins, isWinner: true },
            { name: loserName, attempts: loserAttempts, wins: loserWins, isWinner: false },
          ].map((p, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 border ${p.isWinner ? "border-neon-green/40 bg-neon-green/5" : "border-border bg-muted/30"}`}
            >
              <div className="font-display text-sm font-bold text-muted-foreground mb-1">{p.name}</div>
              <div className={`font-display text-3xl font-black ${p.isWinner ? "neon-text-green" : "neon-text-cyan"}`}>
                {p.attempts}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{p.attempts === 1 ? "attempt" : "attempts"}</div>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground/70">
                <Trophy className="w-3 h-3" />
                {p.wins} {p.wins === 1 ? "win" : "wins"}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRematch}
            className="w-full py-4 rounded-xl font-display font-bold bg-primary text-primary-foreground neon-glow-cyan"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Rematch
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onHome}
            className="w-full py-3 rounded-xl font-display font-bold bg-muted text-foreground"
          >
            <Home className="w-4 h-4 inline mr-2" />
            Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
