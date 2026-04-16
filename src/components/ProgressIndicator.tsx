import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function ProgressIndicator() {
  const { isRunning, currentGeneration, currentBestFitness, config, generationMetrics } = useStore();
  
  if (!isRunning && generationMetrics.length === 0) return null;

  const progress = config.generations > 0
    ? (currentGeneration / config.generations) * 100
    : 0;

  const currentMetrics = generationMetrics[generationMetrics.length - 1];
  const latestConflicts = currentMetrics ? currentMetrics.conflicts : 0;
  const initialConflicts = generationMetrics[0]?.conflicts || latestConflicts;
  
  // Improvement logic
  const diff = initialConflicts - latestConflicts;
  const improvementNode = diff > 0 
    ? <span className="text-sm font-semibold text-accent ml-2">({initialConflicts} &rarr; {latestConflicts} &darr;)</span> 
    : null;

  // Status Logic
  let status = "Initializing";
  if (isRunning) {
    if (progress < 30) status = "Exploring";
    else if (progress < 70) status = "Optimizing";
    else status = "Converging";
  } else {
    status = "Complete";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-card bg-white p-6 shadow-card"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading text-lg font-semibold text-primary">
          {isRunning ? '🔄 Running...' : '✅ Complete'}
        </h2>
        <span className="bg-primary/10 text-primary-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Status: {status}
        </span>
      </div>

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
        <div className="rounded-xl bg-primary-50/50 p-3 text-center">
          <p className="text-xs font-medium text-primary-400">Conflicts</p>
          <div className="mt-1 flex items-center justify-center">
            <p className={`font-heading text-xl font-bold ${latestConflicts > 0 ? 'text-warning' : 'text-accent'}`}>{latestConflicts}</p>
            {improvementNode}
          </div>
        </div>
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
