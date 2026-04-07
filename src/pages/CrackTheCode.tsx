import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, Cpu, Users, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { generateCode } from "@/lib/crackTheCode";
import CTCGamePlay from "@/components/crackthecode/CTCGamePlay";
import CTCSetCode from "@/components/crackthecode/CTCSetCode";
import CTCPassPhone from "@/components/crackthecode/CTCPassPhone";
import { useNavigate } from "react-router-dom";

type Screen = "menu" | "solo" | "couple-set" | "couple-pass" | "couple-play";

export default function CrackTheCode() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("menu");
  const [codeLength, setCodeLength] = useState(4);
  const [secretCode, setSecretCode] = useState<number[]>([]);
  const [p1Name, setP1Name] = useState("Player 1");
  const [p2Name, setP2Name] = useState("Player 2");

  const startSolo = useCallback(() => {
    setSecretCode(generateCode(codeLength));
    setScreen("solo");
  }, [codeLength]);

  const startCouple = useCallback(() => {
    setScreen("couple-set");
  }, []);

  const handleCodeSet = useCallback((code: number[]) => {
    setSecretCode(code);
    setScreen("couple-pass");
  }, []);

  const goHome = useCallback(() => {
    setScreen("menu");
  }, []);

  if (screen === "solo") {
    return (
      <CTCGamePlay
        key={secretCode.join("")}
        secretCode={secretCode}
        codeLength={codeLength}
        onHome={goHome}
        onPlayAgain={startSolo}
      />
    );
  }

  if (screen === "couple-set") {
    return (
      <CTCSetCode
        playerName={p1Name}
        codeLength={codeLength}
        onSubmit={handleCodeSet}
      />
    );
  }

  if (screen === "couple-pass") {
    return (
      <CTCPassPhone
        nextPlayer={p2Name}
        message="Time to crack the code! 🔐"
        onReady={() => setScreen("couple-play")}
      />
    );
  }

  if (screen === "couple-play") {
    return (
      <CTCGamePlay
        key={secretCode.join("") + "-couple"}
        secretCode={secretCode}
        codeLength={codeLength}
        playerName={p2Name}
        onHome={goHome}
        onPlayAgain={startCouple}
      />
    );
  }

  // Menu screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden relative">
      {/* Floating hearts */}
      {["❤️", "🔐", "💕", "🔥", "💖"].map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl md:text-5xl select-none pointer-events-none opacity-10"
          style={{ left: `${15 + i * 18}%`, top: `${10 + (i % 3) * 25}%` }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          {emoji}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10 w-full max-w-md"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl mb-3"
        >
          🔐
        </motion.div>
        <h1 className="font-display text-4xl md:text-5xl font-black mb-2" style={{ color: "hsl(320, 100%, 70%)", textShadow: "0 0 20px hsl(320 100% 60% / 0.5)" }}>
          Crack the Code
        </h1>
        <p className="font-display text-lg mb-1" style={{ color: "hsl(0, 80%, 65%)" }}>❤️</p>
        <p className="text-muted-foreground font-body mb-8">
          Guess the secret code digit by digit!
        </p>

        {/* Code length selector */}
        <div className="glass-panel px-4 py-3 mb-6 mx-auto max-w-xs">
          <p className="font-body text-xs text-muted-foreground mb-2">Code Length</p>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCodeLength(l => Math.max(4, l - 1))}
              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <span className="font-display text-2xl font-black" style={{ color: "hsl(320, 100%, 70%)" }}>
              {codeLength}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCodeLength(l => Math.min(8, l + 1))}
              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Player names for couple mode */}
        <div className="glass-panel px-4 py-3 mb-6 mx-auto max-w-xs">
          <p className="font-body text-xs text-muted-foreground mb-2">Player Names</p>
          <div className="flex gap-2">
            <input
              value={p1Name}
              onChange={e => setP1Name(e.target.value || "Player 1")}
              placeholder="Setter"
              className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground font-body text-sm text-center focus:outline-none focus:border-accent"
            />
            <input
              value={p2Name}
              onChange={e => setP2Name(e.target.value || "Player 2")}
              placeholder="Guesser"
              className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground font-body text-sm text-center focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={startCouple}
            className="w-full max-w-xs flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-lg bg-accent text-accent-foreground neon-glow-pink"
          >
            <Users className="w-5 h-5" />
            Couple Challenge 💕
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={startSolo}
            className="w-full max-w-xs flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-lg bg-primary text-primary-foreground neon-glow-cyan"
          >
            <Cpu className="w-5 h-5" />
            Solo vs AI 🤖
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mt-4 px-6 py-3 rounded-xl font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Games
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
