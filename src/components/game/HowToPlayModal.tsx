import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
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
              <h2 className="font-display text-xl font-bold neon-text-cyan">How to Play</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 font-body text-foreground/80">
              <div className="flex gap-3">
                <span className="font-display text-primary font-bold">1.</span>
                <p>Choose a difficulty level — this sets the range of numbers.</p>
              </div>
              <div className="flex gap-3">
                <span className="font-display text-primary font-bold">2.</span>
                <p>The AI picks a secret number within the range.</p>
              </div>
              <div className="flex gap-3">
                <span className="font-display text-primary font-bold">3.</span>
                <p>Enter your guess. You'll be told if it's <span className="text-guess-low font-semibold">too low</span> or <span className="text-guess-high font-semibold">too high</span>.</p>
              </div>
              <div className="flex gap-3">
                <span className="font-display text-primary font-bold">4.</span>
                <p>Keep guessing until you find the number. Fewer attempts = better score!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 rounded-xl font-display font-bold bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              Got It!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
