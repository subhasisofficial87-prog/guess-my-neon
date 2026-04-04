import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getHighScores as getLocalHighScores } from "@/lib/gameTypes";

interface CloudScore {
  attempts: number;
  difficulty: string;
  range: string;
  played_at: string;
  display_name: string | null;
}

interface HighScoresModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HighScoresModal({ open, onClose }: HighScoresModalProps) {
  const [cloudScores, setCloudScores] = useState<CloudScore[]>([]);
  const [loading, setLoading] = useState(false);
  const localScores = getLocalHighScores();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase
      .from("high_scores")
      .select("attempts, difficulty, range, played_at, user_id")
      .order("attempts", { ascending: true })
      .limit(20)
      .then(async ({ data }) => {
        if (!data || data.length === 0) {
          setCloudScores([]);
          setLoading(false);
          return;
        }
        // Fetch display names
        const userIds = [...new Set(data.map((s) => s.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name")
          .in("user_id", userIds);
        const nameMap = new Map(profiles?.map((p) => [p.user_id, p.display_name]) ?? []);

        setCloudScores(
          data.map((s) => ({
            attempts: s.attempts,
            difficulty: s.difficulty,
            range: s.range,
            played_at: s.played_at,
            display_name: nameMap.get(s.user_id) ?? "Player",
          }))
        );
        setLoading(false);
      });
  }, [open]);

  const hasCloud = cloudScores.length > 0;
  const hasLocal = localScores.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel neon-border p-6 md:p-8 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl font-bold neon-text-cyan flex items-center gap-2">
                <Trophy className="w-5 h-5" /> High Scores
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <p className="text-center text-muted-foreground font-body py-8">Loading...</p>
            ) : (
              <>
                {hasCloud && (
                  <div className="mb-4">
                    <h3 className="font-display text-sm text-muted-foreground mb-2">🌐 Global Leaderboard</h3>
                    <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                      {cloudScores.map((s, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/50 font-body">
                          <div className="flex items-center gap-3">
                            <span className="font-display text-sm text-muted-foreground">#{i + 1}</span>
                            <div>
                              <div className="font-semibold text-foreground">{s.display_name}</div>
                              <div className="text-xs text-muted-foreground capitalize">{s.difficulty} · {s.range}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-display font-bold neon-text-cyan">{s.attempts}</div>
                            <div className="text-xs text-muted-foreground">{s.attempts === 1 ? "try" : "tries"}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasLocal && (
                  <div>
                    <h3 className="font-display text-sm text-muted-foreground mb-2">📱 Local Scores</h3>
                    <div className="space-y-2 max-h-[20vh] overflow-y-auto">
                      {localScores.map((s, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/50 font-body">
                          <div className="flex items-center gap-3">
                            <span className="font-display text-sm text-muted-foreground">#{i + 1}</span>
                            <div>
                              <div className="font-semibold text-foreground capitalize">{s.difficulty}</div>
                              <div className="text-xs text-muted-foreground">{s.range}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-display font-bold neon-text-cyan">{s.attempts}</div>
                            <div className="text-xs text-muted-foreground">{s.attempts === 1 ? "try" : "tries"}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!hasCloud && !hasLocal && (
                  <p className="text-center text-muted-foreground font-body py-8">
                    No scores yet. Play a game to set your first record!
                  </p>
                )}
              </>
            )}

            <button
              onClick={onClose}
              className="w-full mt-6 py-3 rounded-xl font-display font-bold bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
