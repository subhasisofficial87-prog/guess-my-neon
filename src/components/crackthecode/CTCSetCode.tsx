import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import NumberPad from "./NumberPad";
import CodeDisplay from "./CodeDisplay";

interface CTCSetCodeProps {
  playerName: string;
  codeLength: number;
  onSubmit: (code: number[]) => void;
}

export default function CTCSetCode({ playerName, codeLength, onSubmit }: CTCSetCodeProps) {
  const [digits, setDigits] = useState<number[]>([]);

  const handleDigit = useCallback((d: number) => {
    setDigits(prev => prev.length < codeLength ? [...prev, d] : prev);
  }, [codeLength]);

  const handleDelete = useCallback(() => {
    setDigits(prev => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(() => {
    if (digits.length === codeLength) onSubmit(digits);
  }, [digits, codeLength, onSubmit]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 md:p-8 w-full max-w-sm text-center"
        style={{ borderColor: "hsl(320, 100%, 60%)", boxShadow: "0 0 20px hsl(320 100% 60% / 0.2)" }}
      >
        <Lock className="w-10 h-10 mx-auto mb-3 text-accent" />
        <h2 className="font-display text-xl font-bold mb-1" style={{ color: "hsl(320, 100%, 70%)" }}>
          {playerName}
        </h2>
        <p className="font-body text-sm text-muted-foreground mb-5">
          Enter your secret {codeLength}-digit code
        </p>

        <div className="mb-6">
          <CodeDisplay digits={digits} codeLength={codeLength} />
        </div>

        <NumberPad
          onDigit={handleDigit}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          canSubmit={digits.length === codeLength}
        />
      </motion.div>
    </div>
  );
}
