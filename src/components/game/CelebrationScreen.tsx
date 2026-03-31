import { useEffect } from "react";
import { motion } from "framer-motion";
import { PartyPopper, RotateCcw, Share2 } from "lucide-react";
import confetti from "canvas-confetti";

interface CelebrationScreenProps {
  secretNumber: number;
  attempts: number;
  onNewGame: () => void;
}

export default function CelebrationScreen({ secretNumber, attempts, onNewGame }: CelebrationScreenProps) {
  useEffect(() => {
    const fire = () => {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ["#00ffff", "#ff69b4", "#00ff88"] });
    };
    fire();
    const t1 = setTimeout(fire, 300);
    const t2 = setTimeout(fire, 600);
    // Play a ding sound
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.value = 0.3;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const shareText = `🎮 I guessed "My Number Is?" in only ${attempts} ${attempts === 1 ? "try" : "tries"}! 🔥 Can you beat that?`;

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ text: shareText }); } catch {}
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="glass-panel neon-border p-8 md:p-12 text-center max-w-md w-full"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          <PartyPopper className="w-16 h-16 mx-auto mb-4 text-neon-pink" />
        </motion.div>

        <h2 className="font-display text-3xl md:text-4xl font-black neon-text-green mb-2">
          You Got It!
        </h2>
        <p className="font-display text-5xl md:text-6xl font-black neon-text-cyan my-4">
          {secretNumber}
        </p>
        <p className="text-muted-foreground font-body text-lg mb-8">
          in <span className="text-foreground font-bold">{attempts}</span> {attempts === 1 ? "attempt" : "attempts"}
        </p>

        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewGame}
            className="w-full py-4 rounded-xl font-display font-bold bg-primary text-primary-foreground neon-glow-cyan"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            New Game
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="w-full py-4 rounded-xl font-display font-bold bg-secondary text-secondary-foreground neon-glow-pink"
          >
            <Share2 className="w-4 h-4 inline mr-2" />
            Share Result
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
