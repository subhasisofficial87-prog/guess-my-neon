import { motion } from "framer-motion";

interface CodeDisplayProps {
  digits: number[];
  codeLength: number;
  correctPositions?: number[];
  locked?: boolean;
}

export default function CodeDisplay({ digits, codeLength, correctPositions = [], locked }: CodeDisplayProps) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: codeLength }).map((_, i) => {
        const hasDigit = i < digits.length;
        const isCorrect = correctPositions.includes(i);
        return (
          <motion.div
            key={i}
            animate={isCorrect ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`w-12 h-14 md:w-14 md:h-16 rounded-xl border-2 flex items-center justify-center font-display text-2xl md:text-3xl font-black transition-all ${
              isCorrect
                ? "border-neon-green bg-neon-green/20 text-neon-green shadow-[0_0_15px_hsl(140_100%_50%/0.4)]"
                : hasDigit
                ? "border-accent/50 bg-accent/10 text-foreground"
                : "border-border bg-muted/30 text-muted-foreground/30"
            }`}
          >
            {locked ? (hasDigit ? "•" : "") : (hasDigit ? digits[i] : "")}
          </motion.div>
        );
      })}
    </div>
  );
}
