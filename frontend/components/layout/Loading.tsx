"use client";

import { motion } from "framer-motion";

export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-foreground/20 to-foreground/10 border border-border/50 flex items-center justify-center backdrop-blur-sm"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-2xl font-bold text-foreground">A</span>
        </motion.div>

        <motion.p
          className="text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Loading;
