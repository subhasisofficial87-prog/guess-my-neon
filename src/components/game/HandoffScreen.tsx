import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface HandoffScreenProps {
  nextPlayer: string;
  message: string;
  onReady: () => void;
}

export default function HandoffScreen({ nextPlayer, message, onReady }: HandoffScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel neon-border p-8 md:p-10 w-full max-w-md text-center"
      >
        <Users className="w-12 h-12 mx-auto mb-4 text-secondary" />
        <h2 className="font-display text-2xl md:text-3xl font-bold neon-text-pink mb-3">
          Pass the Device!
        </h2>
        <p className="text-muted-foreground font-body text-lg mb-2">
          Hand the device to
        </p>
        <p className="font-display text-3xl font-black neon-text-cyan mb-4">
          {nextPlayer}
        </p>
        <p className="text-muted-foreground/70 font-body text-sm mb-8">
          {message}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReady}
          className="w-full py-4 rounded-xl font-display font-bold text-lg bg-primary text-primary-foreground neon-glow-cyan"
        >
          I'm Ready!
        </motion.button>
      </motion.div>
    </div>
  );
}
