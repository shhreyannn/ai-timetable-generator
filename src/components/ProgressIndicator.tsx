import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function ProgressIndicator() {
  const { isRunning, currentGeneration, currentBestFitness, config, generationMetrics } = useStore();
  
  if (!isRunning && generationMetrics.length === 0) return null;

  const progress = config.generations > 0
    ? (currentGeneration / config.generations) * 100
    : 0;

  const latestConflicts = generationMetrics.length > 0
    ? generationMetrics[generationMetrics.length - 1].conflicts
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-card bg-[#131314]/60 backdrop-blur-xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <h2 className="mb-4 font-heading text-lg font-semibold text-white">
        {isRunning ? '🔄 Running...' : '✅ Complete'}
      </h2>

      {/* Progress bar */}
      <div className="mb-4 overflow-hidden rounded-full bg-[#1a191b] border border-white/5">
        <motion.div
          className="h-3 rounded-full bg-gradient-to-r from-accent to-accent-light"
          initial={{ width: 0 }}
          animate={{ width: `${isRunning ? progress : 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Generation"
          value={`${isRunning ? currentGeneration : config.generations} / ${config.generations}`}
          color="text-white"
        />
        <StatCard
          label="Best Fitness"
          value={currentBestFitness.toFixed(0)}
          color="text-[#d575ff]"
        />
        <StatCard
          label="Conflicts"
          value={latestConflicts.toString()}
          color={latestConflicts > 0 ? 'text-[#ff716c]' : 'text-[#d575ff]'}
        />
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl bg-[#1a191b]/80 border border-white/5 p-3 text-center">
      <p className="text-xs font-medium text-[#adaaab]">{label}</p>
      <p className={`mt-1 font-heading text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
