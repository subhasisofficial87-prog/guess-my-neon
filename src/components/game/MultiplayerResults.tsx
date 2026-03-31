import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, Home, Crown, Equal } from "lucide-react";
import confetti from "canvas-confetti";

interface MultiplayerResultsProps {
  p1Name: string;
  p2Name: string;
  p1Attempts: number;
  p2Attempts: number;
  p1Secret: number;
  p2Secret: number;
  onNewGame: () => void;
  onHome: () => void;
}

export default function MultiplayerResults({
  p1Name, p2Name, p1Attempts, p2Attempts, p1Secret, p2Secret, onNewGame, onHome,
}: MultiplayerResultsProps) {
  const winner = p1Attempts < p2Attempts ? p1Name : p2Attempts < p1Attempts ? p2Name : null;
  const isTie = p1Attempts === p2Attempts;

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
        {isTie ? (
          <Equal className="w-14 h-14 mx-auto mb-3 text-primary" />
        ) : (
          <Crown className="w-14 h-14 mx-auto mb-3 text-neon-pink" />
        )}

        <h2 className="font-display text-3xl md:text-4xl font-black mb-1">
          {isTie ? (
            <span className="neon-text-cyan">It's a Tie!</span>
          ) : (
            <span className="neon-text-green">{winner} Wins!</span>
          )}
        </h2>
        <p className="text-muted-foreground font-body mb-6">
          {isTie ? "Both guessed in the same number of attempts!" : "Fewer guesses wins the round!"}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { name: p1Name, attempts: p1Attempts, secret: p2Secret },
            { name: p2Name, attempts: p2Attempts, secret: p1Secret },
          ].map((p, i) => {
            const isWinner = !isTie && p.name === winner;
            return (
              <div
                key={i}
                className={`rounded-xl p-4 border ${isWinner ? "border-neon-green/40 bg-neon-green/5" : "border-border bg-muted/30"}`}
              >
                <div className="font-display text-sm font-bold text-muted-foreground mb-1">{p.name}</div>
                <div className={`font-display text-3xl font-black ${isWinner ? "neon-text-green" : "neon-text-cyan"}`}>
                  {p.attempts}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{p.attempts === 1 ? "attempt" : "attempts"}</div>
                <div className="text-xs text-muted-foreground/60 mt-2">guessed {p.secret}</div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewGame}
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
