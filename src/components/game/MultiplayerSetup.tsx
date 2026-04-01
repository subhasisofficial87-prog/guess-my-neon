import { useState } from "react";
import { motion } from "framer-motion";
import { Users, ArrowRightLeft, Pencil, Shuffle, UserCheck } from "lucide-react";
import { Difficulty, DIFFICULTY_RANGES, GameSettings } from "@/lib/gameTypes";

export type NumberMode = "random" | "players-choose";

interface MultiplayerSetupProps {
  onStart: (settings: GameSettings, p1Name: string, p2Name: string, firstPlayer: 1 | 2, numberMode: NumberMode) => void;
  onBack: () => void;
}

const difficulties: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "Easy", desc: "1 – 50" },
  { key: "medium", label: "Medium", desc: "1 – 100" },
  { key: "hard", label: "Hard", desc: "1 – 1,000" },
  { key: "custom", label: "Custom", desc: "You choose" },
];

export default function MultiplayerSetup({ onStart, onBack }: MultiplayerSetupProps) {
  const [p1Name, setP1Name] = useState("Player 1");
  const [p2Name, setP2Name] = useState("Player 2");
  const [firstPlayer, setFirstPlayer] = useState<1 | 2>(1);
  const [numberMode, setNumberMode] = useState<NumberMode>("random");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [customMin, setCustomMin] = useState(1);
  const [customMax, setCustomMax] = useState(200);
  const [editingP1, setEditingP1] = useState(false);
  const [editingP2, setEditingP2] = useState(false);

  const handleStart = () => {
    const name1 = p1Name.trim() || "Player 1";
    const name2 = p2Name.trim() || "Player 2";
    if (difficulty === "custom") {
      const min = Math.min(customMin, customMax);
      const max = Math.max(customMin, customMax);
      if (max - min < 1) return;
      onStart({ difficulty, min, max }, name1, name2, firstPlayer, numberMode);
    } else {
      const range = DIFFICULTY_RANGES[difficulty];
      onStart({ difficulty, ...range }, name1, name2, firstPlayer, numberMode);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel neon-border p-6 md:p-8 w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-secondary" />
          <h2 className="font-display text-xl font-bold neon-text-pink">2 Player Setup</h2>
        </div>

        {/* Player Names */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { name: p1Name, setName: setP1Name, editing: editingP1, setEditing: setEditingP1, label: "Player 1", color: "neon-text-cyan" },
            { name: p2Name, setName: setP2Name, editing: editingP2, setEditing: setEditingP2, label: "Player 2", color: "neon-text-pink" },
          ].map((p, i) => (
            <div key={i} className="rounded-xl border border-border p-3 bg-muted/20">
              <div className="text-xs text-muted-foreground font-body mb-1">{p.label}</div>
              {p.editing ? (
                <input
                  autoFocus
                  value={p.name}
                  onChange={(e) => p.setName(e.target.value)}
                  onBlur={() => p.setEditing(false)}
                  onKeyDown={(e) => e.key === "Enter" && p.setEditing(false)}
                  maxLength={12}
                  className="w-full bg-input border border-border rounded-lg px-2 py-1 text-foreground font-display text-sm focus:outline-none focus:border-primary"
                />
              ) : (
                <button
                  onClick={() => p.setEditing(true)}
                  className={`flex items-center gap-1 font-display text-sm font-bold ${p.color} hover:opacity-80 transition-opacity`}
                >
                  {p.name}
                  <Pencil className="w-3 h-3 opacity-50" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Who goes first */}
        <div className="mb-6">
          <div className="text-sm text-muted-foreground font-body mb-2 flex items-center gap-1">
            <ArrowRightLeft className="w-3.5 h-3.5" /> Who goes first?
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((p) => (
              <button
                key={p}
                onClick={() => setFirstPlayer(p as 1 | 2)}
                className={`py-2.5 rounded-xl font-display text-sm font-bold border transition-all ${
                  firstPlayer === p
                    ? "border-primary neon-glow-cyan bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {p === 1 ? p1Name : p2Name}
              </button>
            ))}
          </div>
        </div>

        {/* Number Mode */}
        <div className="mb-6">
          <div className="text-sm text-muted-foreground font-body mb-2 flex items-center gap-1">
            Secret Number
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setNumberMode("random")}
              className={`py-2.5 px-3 rounded-xl font-display text-sm font-bold border transition-all flex items-center justify-center gap-1.5 ${
                numberMode === "random"
                  ? "border-primary neon-glow-cyan bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-muted-foreground"
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" /> Random
            </button>
            <button
              onClick={() => setNumberMode("players-choose")}
              className={`py-2.5 px-3 rounded-xl font-display text-sm font-bold border transition-all flex items-center justify-center gap-1.5 ${
                numberMode === "players-choose"
                  ? "border-primary neon-glow-cyan bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-muted-foreground"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Players Choose
            </button>
          </div>
          {numberMode === "players-choose" && (
            <p className="text-xs text-muted-foreground/60 font-body mt-2">
              Each player picks a secret number for the other to guess
            </p>
          )}
        </div>

        <div className="mb-6">
          <div className="text-sm text-muted-foreground font-body mb-2">Difficulty</div>
          <div className="grid grid-cols-2 gap-3">
            {difficulties.map((d) => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={`p-3 rounded-xl border text-left transition-all font-body ${
                  difficulty === d.key
                    ? "border-primary neon-glow-cyan bg-primary/10"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="font-semibold text-foreground text-sm">{d.label}</div>
                <div className="text-xs text-muted-foreground">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {difficulty === "custom" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="flex gap-4 mb-6"
          >
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block font-body">Min</label>
              <input
                type="number"
                value={customMin}
                onChange={(e) => setCustomMin(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground font-body focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block font-body">Max</label>
              <input
                type="number"
                value={customMax}
                onChange={(e) => setCustomMax(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground font-body focus:outline-none focus:border-primary"
              />
            </div>
          </motion.div>
        )}

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="px-6 py-4 rounded-xl font-display font-bold bg-muted text-foreground"
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="flex-1 py-4 rounded-xl font-display font-bold text-lg bg-primary text-primary-foreground neon-glow-cyan"
          >
            Start Game!
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
