import { motion } from "framer-motion";
import { CTCGuess } from "@/lib/crackTheCode";
import { formatFeedback } from "@/lib/crackTheCode";
import { useRef, useEffect } from "react";

interface GuessHistoryProps {
  guesses: CTCGuess[];
  codeLength: number;
}

export default function GuessHistory({ guesses, codeLength }: GuessHistoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [guesses.length]);

  if (guesses.length === 0) {
    return (
      <p className="text-center text-muted-foreground/40 font-body py-4 text-sm">
        Your guesses will appear here...
      </p>
    );
  }

  return (
    <div ref={ref} className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
      {guesses.map((g, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel px-3 py-2 flex items-center gap-3"
        >
          <span className="text-muted-foreground text-xs font-display w-6">#{i + 1}</span>
          <div className="flex gap-1">
            {g.digits.map((d, j) => (
              <span
                key={j}
                className={`w-7 h-8 rounded-md flex items-center justify-center font-display text-sm font-bold ${
                  g.correctPositions.includes(j)
                    ? "bg-neon-green/20 text-neon-green"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {d}
              </span>
            ))}
          </div>
          <span className="text-xs font-body text-muted-foreground flex-1 text-right">
            {formatFeedback(g.correctPositions, codeLength)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
