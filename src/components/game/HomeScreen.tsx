import { motion } from "framer-motion";
import { Play, HelpCircle, Trophy, Users } from "lucide-react";

interface HomeScreenProps {
  onStart: () => void;
  onMultiplayer: () => void;
  onHowToPlay: () => void;
  onHighScores: () => void;
}

const FloatingNumber = ({ children, delay, x, y }: { children: string; delay: number; x: string; y: string }) => (
  <motion.span
    className="absolute font-display text-primary/10 text-6xl md:text-8xl select-none pointer-events-none"
    style={{ left: x, top: y }}
    animate={{ y: [0, -15, 0], opacity: [0.08, 0.15, 0.08] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    {children}
  </motion.span>
);

export default function HomeScreen({ onStart, onMultiplayer, onHowToPlay, onHighScores }: HomeScreenProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden">
      <FloatingNumber delay={0} x="10%" y="15%">7</FloatingNumber>
      <FloatingNumber delay={0.5} x="80%" y="10%">42</FloatingNumber>
      <FloatingNumber delay={1} x="5%" y="70%">99</FloatingNumber>
      <FloatingNumber delay={1.5} x="85%" y="65%">13</FloatingNumber>
      <FloatingNumber delay={2} x="50%" y="80%">?</FloatingNumber>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10"
      >
        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-black neon-text-cyan mb-4 tracking-tight"
          animate={{ textShadow: ["0 0 10px hsl(180 100% 50% / 0.5)", "0 0 30px hsl(180 100% 50% / 0.8)", "0 0 10px hsl(180 100% 50% / 0.5)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          My Number Is?
        </motion.h1>
        <p className="text-muted-foreground text-lg md:text-xl mb-12 font-body">
          Guess the secret number before it's too late!
        </p>

        <div className="flex flex-col gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="flex items-center gap-3 px-10 py-4 rounded-xl font-display font-bold text-lg bg-primary text-primary-foreground neon-glow-cyan transition-all"
          >
            <Play className="w-5 h-5" />
            Solo Game
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMultiplayer}
            className="flex items-center gap-3 px-10 py-4 rounded-xl font-display font-bold text-lg bg-secondary text-secondary-foreground neon-glow-pink transition-all"
          >
            <Users className="w-5 h-5" />
            2 Player Mode
          </motion.button>

          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHowToPlay}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-body font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              How to Play
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHighScores}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-body font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Trophy className="w-4 h-4" />
              High Scores
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
