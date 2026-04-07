import { useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Home, Share2 } from "lucide-react";
import confetti from "canvas-confetti";

interface CTCWinScreenProps {
  attempts: number;
  code: number[];
  playerName?: string;
  onPlayAgain: () => void;
  onHome: () => void;
}

export default function CTCWinScreen({ attempts, code, playerName, onPlayAgain, onHome }: CTCWinScreenProps) {
  useEffect(() => {
    const end = Date.now() + 2000;
    const fire = () => {
      confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 }, colors: ["#ff2d87", "#00ffcc", "#ff6b6b", "#ffd93d"] });
      if (Date.now() < end) requestAnimationFrame(fire);
    };
    fire();
  }, []);

  const shareText = `🔐 I cracked the code ${code.join("")} in ${attempts} attempts on Crack the Code ❤️! Can you beat me?`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: shareText }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="glass-panel p-8 md:p-10 w-full max-w-md text-center"
        style={{ borderColor: "hsl(320, 100%, 60%)", boxShadow: "0 0 30px hsl(320 100% 60% / 0.3)" }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="text-5xl md:text-6xl mb-4"
        >
          🔓
        </motion.div>
        <h1 className="font-display text-3xl md:text-4xl font-black mb-2" style={{ color: "hsl(320, 100%, 70%)" }}>
          CODE CRACKED!
        </h1>
        {playerName && (
          <p className="font-body text-lg text-foreground mb-2">{playerName} wins!</p>
        )}
        <div className="flex gap-1 justify-center my-4">
          {code.map((d, i) => (
            <span key={i} className="w-12 h-14 rounded-xl bg-neon-green/20 border-2 border-neon-green flex items-center justify-center font-display text-2xl font-black text-neon-green">
              {d}
            </span>
          ))}
        </div>
        <p className="font-body text-muted-foreground mb-6">
          Cracked in <span className="font-display font-bold text-foreground">{attempts}</span> attempts
        </p>

        <div className="flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            className="w-full py-3 rounded-xl font-display font-bold bg-accent text-accent-foreground neon-glow-pink"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Play Again
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="w-full py-3 rounded-xl font-display font-bold bg-neon-green/20 text-neon-green"
          >
            <Share2 className="w-4 h-4 inline mr-2" />
            Share Result
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="w-full py-3 rounded-xl font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4 inline mr-2" />
            Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
