import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";
import { getHighScores } from "@/lib/gameTypes";

interface HighScoresModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HighScoresModal({ open, onClose }: HighScoresModalProps) {
  const scores = getHighScores();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel neon-border p-6 md:p-8 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl font-bold neon-text-cyan flex items-center gap-2">
                <Trophy className="w-5 h-5" /> High Scores
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {scores.length === 0 ? (
              <p className="text-center text-muted-foreground font-body py-8">
                No scores yet. Play a game to set your first record!
              </p>
            ) : (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {scores.map((s, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/50 font-body">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-sm text-muted-foreground">#{i + 1}</span>
                      <div>
                        <div className="font-semibold text-foreground capitalize">{s.difficulty}</div>
                        <div className="text-xs text-muted-foreground">{s.range}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold neon-text-cyan">{s.attempts}</div>
                      <div className="text-xs text-muted-foreground">{s.attempts === 1 ? "try" : "tries"}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full mt-6 py-3 rounded-xl font-display font-bold bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
