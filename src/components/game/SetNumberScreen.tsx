import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { GameSettings } from "@/lib/gameTypes";

interface SetNumberScreenProps {
  playerName: string;
  settings: GameSettings;
  onSubmit: (number: number) => void;
}

export default function SetNumberScreen({ playerName, settings, onSubmit }: SetNumberScreenProps) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const num = parseInt(value);
    if (isNaN(num) || num < settings.min || num > settings.max) {
      setError(`Pick a number between ${settings.min} and ${settings.max}`);
      return;
    }
    setError("");
    onSubmit(num);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel neon-border p-8 md:p-10 w-full max-w-md text-center"
      >
        <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary font-display text-sm font-bold mb-4">
          {playerName}'s Turn
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold neon-text-cyan mb-2">
          Pick Your Secret Number
        </h2>
        <p className="text-muted-foreground font-body mb-2">
          Choose a number between{" "}
          <span className="neon-text-pink font-bold">{settings.min}</span> and{" "}
          <span className="neon-text-pink font-bold">{settings.max}</span>
        </p>
        <p className="text-muted-foreground/60 font-body text-sm mb-6">
          Don't let the other player see! 👀
        </p>

        <div className="relative mb-4">
          <input
            ref={inputRef}
            type={show ? "number" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter secret number..."
            className="w-full px-6 py-4 rounded-xl bg-input border-2 border-border text-foreground font-display text-xl text-center focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {error && (
          <p className="text-destructive font-body text-sm mb-4">{error}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full py-4 rounded-xl font-display font-bold text-lg bg-primary text-primary-foreground neon-glow-cyan"
        >
          Lock It In 🔒
        </motion.button>
      </motion.div>
    </div>
  );
}
