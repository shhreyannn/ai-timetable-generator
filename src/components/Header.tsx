import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-card bg-gradient-to-r from-[#131314] via-[#1a191b] to-[#0e0e0f] border border-white/5 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#d575ff]" />
        <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-[#0e0e0f]" />
        <div className="absolute right-1/3 top-1/2 h-20 w-20 rounded-full bg-[#eaaeff]" />
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-1 inline-block rounded-full bg-[#d575ff]/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#eaaeff]"
        >
          Genetic Algorithm · Constraint Optimization
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="font-heading text-3xl font-bold text-white md:text-4xl"
        >
          AI-Based Timetable Generator
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-2 max-w-2xl font-body text-sm text-[#adaaab]/80 md:text-base"
        >
          Generate optimized B.Tech CSE academic timetables for 30 sections (A1–O2)
          using evolutionary computation. Configure constraints, run the algorithm,
          and visualize convergence in real-time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 flex flex-wrap gap-3"
        >
          {['30 Sections (A1–O2)', '8 CSE Subjects', '60 Faculty', '15 Rooms'].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/70"
              >
                {tag}
              </span>
            )
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}
