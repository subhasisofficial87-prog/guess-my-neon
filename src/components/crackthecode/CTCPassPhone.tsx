import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";

interface CTCPassPhoneProps {
  nextPlayer: string;
  message: string;
  onReady: () => void;
}

export default function CTCPassPhone({ nextPlayer, message, onReady }: CTCPassPhoneProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 md:p-10 w-full max-w-md text-center"
        style={{ borderColor: "hsl(320, 100%, 60%)", boxShadow: "0 0 25px hsl(320 100% 60% / 0.3)" }}
      >
        <motion.div
          animate={{ rotate: [0, -15, 15, -15, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          className="text-5xl mb-4 inline-block"
        >
          📱
        </motion.div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: "hsl(320, 100%, 70%)" }}>
          PASS THE PHONE!
        </h2>
        <p className="text-muted-foreground font-body text-lg mb-1">
          Hand the device to
        </p>
        <p className="font-display text-3xl font-black neon-text-cyan mb-3">
          {nextPlayer}
        </p>
        <p className="text-muted-foreground/70 font-body text-sm mb-6">
          {message}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReady}
          className="w-full py-4 rounded-xl font-display font-bold text-lg bg-accent text-accent-foreground neon-glow-pink"
        >
          I'm Ready! 💪
        </motion.button>
      </motion.div>
    </div>
  );
}
