import { motion } from "framer-motion";
import { Delete, Check } from "lucide-react";

interface NumberPadProps {
  onDigit: (d: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
}

export default function NumberPad({ onDigit, onDelete, onSubmit, canSubmit }: NumberPadProps) {
  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
      {buttons.map((n) => (
        <motion.button
          key={n}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDigit(n)}
          className="h-14 rounded-xl font-display text-xl font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors active:bg-accent/30"
        >
          {n}
        </motion.button>
      ))}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onDelete}
        className="h-14 rounded-xl font-display text-lg font-bold bg-destructive/20 hover:bg-destructive/30 text-destructive transition-colors flex items-center justify-center"
      >
        <Delete className="w-5 h-5" />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onDigit(0)}
        className="h-14 rounded-xl font-display text-xl font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors"
      >
        0
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`h-14 rounded-xl font-display text-lg font-bold flex items-center justify-center transition-colors ${
          canSubmit
            ? "bg-neon-green/20 hover:bg-neon-green/30 text-neon-green"
            : "bg-muted/50 text-muted-foreground/30 cursor-not-allowed"
        }`}
      >
        <Check className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
