import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      if (!displayName.trim()) {
        setError("Please enter a display name");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, displayName.trim());
      if (error) setError(error);
      else setSignupSuccess(true);
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error);
      else navigate("/");
    }
    setLoading(false);
  };

  if (signupSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel neon-border p-8 md:p-10 w-full max-w-md text-center"
        >
          <h2 className="font-display text-2xl font-bold neon-text-green mb-4">Check Your Email!</h2>
          <p className="text-muted-foreground font-body mb-6">
            We sent a confirmation link to <span className="text-foreground font-semibold">{email}</span>. Click it to activate your account.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl font-display font-bold bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel neon-border p-8 md:p-10 w-full max-w-md"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Game
        </button>

        <h2 className="font-display text-2xl md:text-3xl font-bold neon-text-cyan mb-2 text-center">
          {mode === "login" ? "Welcome Back!" : "Join the Game!"}
        </h2>
        <p className="text-muted-foreground font-body text-center mb-6">
          {mode === "login" ? "Sign in to track your scores" : "Create an account to save your high scores"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-input border-2 border-border text-foreground font-body focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-input border-2 border-border text-foreground font-body focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl bg-input border-2 border-border text-foreground font-body focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
          />

          {error && <p className="text-destructive font-body text-sm">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-display font-bold text-lg bg-primary text-primary-foreground neon-glow-cyan disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? (
              <><LogIn className="w-4 h-4 inline mr-2" />Sign In</>
            ) : (
              <><UserPlus className="w-4 h-4 inline mr-2" />Sign Up</>
            )}
          </motion.button>
        </form>

        <p className="text-center text-muted-foreground font-body text-sm mt-6">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            className="neon-text-pink font-semibold hover:underline"
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
