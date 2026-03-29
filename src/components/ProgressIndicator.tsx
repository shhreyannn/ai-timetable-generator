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
      className="rounded-card bg-white p-6 shadow-card"
    >
      <h2 className="mb-4 font-heading text-lg font-semibold text-primary">
        {isRunning ? '🔄 Running...' : '✅ Complete'}
      </h2>

      {/* Progress bar */}
      <div className="mb-4 overflow-hidden rounded-full bg-primary-50">
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
          color="text-primary"
        />
        <StatCard
          label="Best Fitness"
          value={currentBestFitness.toFixed(0)}
          color="text-accent"
        />
        <StatCard
          label="Conflicts"
          value={latestConflicts.toString()}
          color={latestConflicts > 0 ? 'text-warning' : 'text-accent'}
        />
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl bg-primary-50/50 p-3 text-center">
      <p className="text-xs font-medium text-primary-400">{label}</p>
      <p className={`mt-1 font-heading text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
