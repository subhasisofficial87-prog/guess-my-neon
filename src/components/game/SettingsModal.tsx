import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Difficulty, DIFFICULTY_RANGES, GameSettings } from "@/lib/gameTypes";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onStart: (settings: GameSettings) => void;
}

const difficulties: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "Easy", desc: "1 – 50" },
  { key: "medium", label: "Medium", desc: "1 – 100" },
  { key: "hard", label: "Hard", desc: "1 – 1,000" },
  { key: "custom", label: "Custom", desc: "You choose" },
];

export default function SettingsModal({ open, onClose, onStart }: SettingsModalProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [customMin, setCustomMin] = useState(1);
  const [customMax, setCustomMax] = useState(200);

  const handleStart = () => {
    if (difficulty === "custom") {
      const min = Math.min(customMin, customMax);
      const max = Math.max(customMin, customMax);
      if (max - min < 1) return;
      onStart({ difficulty, min, max });
    } else {
      const range = DIFFICULTY_RANGES[difficulty];
      onStart({ difficulty, ...range });
    }
  };

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
            className="glass-panel p-6 md:p-8 w-full max-w-md neon-border"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl font-bold neon-text-cyan">Game Settings</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {difficulties.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  className={`p-4 rounded-xl border text-left transition-all font-body ${
                    difficulty === d.key
                      ? "border-primary neon-glow-cyan bg-primary/10"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <div className="font-semibold text-foreground">{d.label}</div>
                  <div className="text-sm text-muted-foreground">{d.desc}</div>
                </button>
              ))}
            </div>

            {difficulty === "custom" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="flex gap-4 mb-6"
              >
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-1 block font-body">Min</label>
                  <input
                    type="number"
                    value={customMin}
                    onChange={(e) => setCustomMin(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground font-body focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-1 block font-body">Max</label>
                  <input
                    type="number"
                    value={customMax}
                    onChange={(e) => setCustomMax(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground font-body focus:outline-none focus:border-primary"
                  />
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="w-full py-4 rounded-xl font-display font-bold text-lg bg-primary text-primary-foreground neon-glow-cyan"
            >
              Let's Go!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
