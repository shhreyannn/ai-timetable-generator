import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const ALGO_LABELS: Record<string, string> = {
  'standard': 'Standard GA',
  'steady-state': 'Steady-State GA',
  'adaptive-mutation': 'Adaptive Mutation GA',
};

export default function ResultsPanel() {
  const { result, randomResult, compareWithRandom, config } = useStore();

  if (!result) return null;

  const conflictReduction = result.initialConflicts > 0
    ? ((result.initialConflicts - result.finalConflicts) / result.initialConflicts * 100).toFixed(1)
    : '100.0';

  const fitnessImprovement = result.initialFitness > 0
    ? ((result.finalFitness - result.initialFitness) / result.initialFitness * 100).toFixed(1)
    : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-card bg-[#131314]/60 backdrop-blur-xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <h2 className="mb-2 font-heading text-lg font-semibold text-white">
        📊 Results & Metrics
      </h2>

      {/* Algorithm info badge */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#1a191b] border border-white/5 px-3 py-1 text-xs font-semibold text-primary-600">
          🧬 {ALGO_LABELS[config.algorithmType] ?? config.algorithmType}
        </span>
        <span className="rounded-full bg-[#1a191b] border border-white/5 px-3 py-1 text-xs font-medium text-[#adaaab]">
          {config.seed === 0 ? '🎲 Random seed' : `🌱 Seed: ${config.seed}`}
        </span>
      </div>

      {/* GA Results */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard
          label="Initial Fitness"
          value={result.initialFitness.toFixed(0)}
          color="bg-[#1a191b] border border-white/5 text-white"
        />
        <MetricCard
          label="Final Fitness"
          value={result.finalFitness.toFixed(0)}
          color="bg-[#d575ff]/10 text-[#d575ff]-dark"
          highlight
        />
        <MetricCard
          label="Conflict Reduction"
          value={`${conflictReduction}%`}
          color={parseFloat(conflictReduction) >= 80 ? 'bg-[#d575ff]/10 text-[#d575ff]-dark' : 'bg-warning/10 text-[#ff716c]'}
          highlight={parseFloat(conflictReduction) >= 80}
        />
        <MetricCard
          label="Execution Time"
          value={`${(result.executionTimeMs / 1000).toFixed(2)}s`}
          color="bg-[#1a191b] border border-white/5 text-primary-700"
        />
      </div>

      {/* Detailed breakdown */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/5 p-3">
          <p className="text-xs font-medium text-[#adaaab]">Initial Conflicts</p>
          <p className="mt-1 font-heading text-2xl font-bold text-[#ff716c]">
            {result.initialConflicts}
          </p>
        </div>
        <div className="rounded-xl border border-white/5 p-3">
          <p className="text-xs font-medium text-[#adaaab]">Final Conflicts</p>
          <p className={`mt-1 font-heading text-2xl font-bold ${
            result.finalConflicts === 0 ? 'text-[#d575ff]' : 'text-[#ff716c]'
          }`}>
            {result.finalConflicts}
          </p>
        </div>
      </div>

      {/* Fitness improvement bar */}
      <div className="mb-4 rounded-xl bg-[#1a191b]/80 border border-white/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-[#adaaab]">Fitness Improvement</span>
          <span className="text-xs font-bold text-[#d575ff]">{fitnessImprovement}%</span>
        </div>
        <div className="overflow-hidden rounded-full bg-primary-100">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-accent to-accent-light"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(100, Math.max(0, parseFloat(fitnessImprovement || '0')))}%`
            }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Comparison with Random */}
      {compareWithRandom && randomResult && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border-2 border-dashed border-white/10 p-4"
        >
          <h3 className="mb-3 font-heading text-sm font-semibold text-white">
            🔀 GA vs Random Scheduler
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <CompareMetric label="Fitness" ga={result.finalFitness} random={randomResult.fitness} />
            <CompareMetric
              label="Conflicts"
              ga={result.finalConflicts}
              random={randomResult.conflicts}
              lowerIsBetter
            />
            <div className="rounded-xl bg-[#d575ff]/5 p-3 text-center">
              <p className="text-xs font-medium text-[#adaaab]">GA Advantage</p>
              <p className="mt-1 font-heading text-lg font-bold text-[#d575ff]">
                {randomResult.fitness > 0
                  ? `${((result.finalFitness / randomResult.fitness - 1) * 100).toFixed(0)}%`
                  : '∞'}
              </p>
              <p className="text-[10px] text-[#d575ff]-dark">better fitness</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function MetricCard({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl p-3 text-center ${color} ${highlight ? 'ring-2 ring-accent/20' : ''}`}
    >
      <p className="text-[10px] font-medium opacity-70">{label}</p>
      <p className="mt-1 font-heading text-xl font-bold">{value}</p>
    </motion.div>
  );
}

function CompareMetric({
  label,
  ga,
  random,
  lowerIsBetter,
}: {
  label: string;
  ga: number;
  random: number;
  lowerIsBetter?: boolean;
}) {
  const gaWins = lowerIsBetter ? ga < random : ga > random;
  return (
    <div className="rounded-xl bg-[#1a191b]/80 border border-white/5 p-3 text-center">
      <p className="text-xs font-medium text-[#adaaab]">{label}</p>
      <div className="mt-1 flex items-center justify-center gap-2">
        <span className={`font-heading text-sm font-bold ${gaWins ? 'text-[#d575ff]' : 'text-[#ff716c]'}`}>
          GA: {ga.toFixed(0)}
        </span>
        <span className="text-xs text-gray-300">vs</span>
        <span className={`font-heading text-sm font-bold ${!gaWins ? 'text-[#d575ff]' : 'text-[#ff716c]'}`}>
          R: {random.toFixed(0)}
        </span>
      </div>
    </div>
  );
}
