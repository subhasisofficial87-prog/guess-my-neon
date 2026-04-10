import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  shortDescription: string;
  steps: string[];
  accentColor?: string;
}

export default function HowToPlayModal({ open, onClose, title = "How to Play", shortDescription, steps, accentColor }: HowToPlayModalProps) {
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
            className="glass-panel neon-border p-6 md:p-8 w-full max-w-md max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold" style={accentColor ? { color: accentColor, textShadow: `0 0 15px ${accentColor}50` } : undefined}>
                {!accentColor && <span className="neon-text-cyan">{title}</span>}
                {accentColor && title}
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Short description */}
            <p className="font-body text-foreground/90 text-sm leading-relaxed mb-5 px-1">
              {shortDescription}
            </p>

            <div className="w-full h-px bg-border mb-5" />

            {/* Step-by-step */}
            <h3 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Step by Step</h3>
            <div className="space-y-3 font-body text-foreground/80">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-display font-bold shrink-0" style={{ color: accentColor || "hsl(var(--primary))" }}>{i + 1}.</span>
                  <p className="text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-3 rounded-xl font-display font-bold bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              Got It!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
