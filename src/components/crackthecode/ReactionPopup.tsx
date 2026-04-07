import { motion, AnimatePresence } from "framer-motion";

interface ReactionPopupProps {
  text: string | null;
}

export default function ReactionPopup({ text }: ReactionPopupProps) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          key={text}
          initial={{ scale: 0, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, y: -30 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="font-display text-3xl md:text-5xl font-black text-center px-4 drop-shadow-[0_0_30px_hsl(320_100%_60%/0.6)]"
            style={{ color: "hsl(320, 100%, 70%)" }}
          >
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
