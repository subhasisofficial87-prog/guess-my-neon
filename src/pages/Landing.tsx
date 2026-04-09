import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Zap, Target, TrendingUp, Clock } from "lucide-react";
import Brain3D from "@/components/Brain3D";

const features = [
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Sharpen Your Mind",
    desc: "Challenge your brain with puzzles that boost memory, logic, and pattern recognition.",
  },
  {
    icon: <Target className="w-7 h-7" />,
    title: "Track Progress",
    desc: "Beat your personal bests and climb global leaderboards. Every game makes you sharper.",
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    title: "Daily Brain Workout",
    desc: "Just 5 minutes a day keeps your mind agile. Fun, fast, and scientifically engaging.",
  },
  {
    icon: <Clock className="w-7 h-7" />,
    title: "Play Anytime",
    desc: "Mobile-friendly games you can play on the bus, in bed, or during a break. No excuses!",
  },
];

const FloatingShape = ({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: x, top: y, width: size, height: size, background: color }}
    animate={{ y: [0, -20, 0], scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
    transition={{ duration: 5 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background shapes */}
      <FloatingShape delay={0} x="5%" y="20%" size={200} color="hsla(200, 80%, 60%, 0.06)" />
      <FloatingShape delay={1} x="80%" y="10%" size={160} color="hsla(340, 80%, 70%, 0.06)" />
      <FloatingShape delay={2} x="70%" y="70%" size={240} color="hsla(200, 80%, 60%, 0.05)" />
      <FloatingShape delay={1.5} x="15%" y="75%" size={180} color="hsla(340, 80%, 70%, 0.05)" />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-6"
          >
            <Brain3D />
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight">
            <span className="neon-text-cyan">Brain</span>{" "}
            <span className="neon-text-pink">Games</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-4 font-body leading-relaxed">
            Exercise your brain with fun, addictive challenges designed to boost your
            <span className="text-primary font-semibold"> memory</span>,
            <span className="text-secondary font-semibold"> logic</span>, and
            <span className="neon-text-green font-semibold"> problem-solving</span> skills.
            Whether you've got 2 minutes or 20 — there's always time to level up your mind.
          </p>

          <p className="text-muted-foreground/70 text-base md:text-lg max-w-xl mb-10 font-body">
            Solo challenges, multiplayer battles, and leaderboards — all free, all in your browser. 🧠🔥
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/numbers")}
            className="flex items-center gap-3 px-12 py-5 rounded-2xl font-display font-bold text-xl bg-primary text-primary-foreground neon-glow-cyan transition-all"
          >
            <Gamepad2 className="w-6 h-6" />
            Play Games
          </motion.button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 pb-24 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-center mb-14 neon-text-cyan"
        >
          Why Brain Games?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-panel p-6 hover:border-primary/40 transition-colors group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:neon-glow-cyan transition-all">
                {f.icon}
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8 text-center">
        <p className="text-muted-foreground/50 text-sm font-body">
          © {new Date().getFullYear()} Brain Games — Train your brain, one game at a time. 🧠
        </p>
      </footer>
    </div>
  );
}
