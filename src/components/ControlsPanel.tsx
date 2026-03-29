import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useGAWorker } from '../hooks/useGAWorker';
import type { GAAlgorithmType } from '../utils/types';

const ALGORITHM_OPTIONS: { value: GAAlgorithmType; label: string; desc: string }[] = [
  {
    value: 'standard',
    label: 'Standard GA',
    desc: 'Generational replacement with elitism. Classic and reliable.',
  },
  {
    value: 'steady-state',
    label: 'Steady-State GA',
    desc: 'Replaces only the worst individuals each generation. Preserves diversity.',
  },
  {
    value: 'adaptive-mutation',
    label: 'Adaptive Mutation GA',
    desc: 'Auto-adjusts mutation rate based on stagnation. Escapes local optima.',
  },
];

export default function ControlsPanel() {
  const { config, setConfig, isRunning, compareWithRandom, setCompareWithRandom, inputData } =
    useStore();
  const { runGA, cancelGA } = useGAWorker();
  const hasData = inputData.teachers.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <h2 className="mb-4 font-heading text-lg font-semibold text-primary">⚙️ Algorithm Controls</h2>

      <div className="space-y-5">
        {/* Algorithm Type Selector */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-primary-400">
            Algorithm Variant
          </label>
          <div className="space-y-2">
            {ALGORITHM_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfig({ algorithmType: opt.value })}
                disabled={isRunning}
                className={`w-full rounded-xl border-2 p-3 text-left transition-all disabled:opacity-50 ${
                  config.algorithmType === opt.value
                    ? 'border-primary bg-primary-50 shadow-sm'
                    : 'border-primary-100 hover:border-primary-200 hover:bg-primary-50/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full border-2 transition-all ${
                      config.algorithmType === opt.value
                        ? 'border-primary bg-primary'
                        : 'border-primary-300'
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      config.algorithmType === opt.value ? 'text-primary' : 'text-primary-600'
                    }`}
                  >
                    {opt.label}
                  </span>
                </div>
                <p className="mt-1 pl-5 text-[10px] leading-tight text-primary-400">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-50" />

        {/* Population Size */}
        <SliderControl
          label="Population Size"
          value={config.populationSize}
          min={10}
          max={200}
          step={10}
          onChange={(v) => setConfig({ populationSize: v })}
          disabled={isRunning}
        />

        {/* Generations */}
        <SliderControl
          label="Generations"
          value={config.generations}
          min={10}
          max={500}
          step={10}
          onChange={(v) => setConfig({ generations: v })}
          disabled={isRunning}
        />

        {/* Mutation Rate */}
        <SliderControl
          label={config.algorithmType === 'adaptive-mutation' ? 'Initial Mutation Rate' : 'Mutation Rate'}
          value={config.mutationRate}
          min={0.01}
          max={0.5}
          step={0.01}
          onChange={(v) => setConfig({ mutationRate: v })}
          disabled={isRunning}
          format={(v) => v.toFixed(2)}
        />

        {/* Tournament Size */}
        <SliderControl
          label="Tournament Size"
          value={config.tournamentSize}
          min={2}
          max={10}
          step={1}
          onChange={(v) => setConfig({ tournamentSize: v })}
          disabled={isRunning}
        />

        {/* Crossover Type */}
        <div>
          <label className="mb-1 block text-xs font-medium text-primary-400">Crossover Type</label>
          <div className="flex gap-2">
            {(['one-point', 'two-point'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setConfig({ crossoverType: type })}
                disabled={isRunning}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all disabled:opacity-50 ${
                  config.crossoverType === type
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                }`}
              >
                {type === 'one-point' ? '1-Point' : '2-Point'}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-50" />

        {/* Seed */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-medium text-primary-400">
              Random Seed
              <span className="ml-1 text-[10px] text-primary-300">(0 = random each run)</span>
            </label>
            <span className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600">
              {config.seed === 0 ? 'Random' : config.seed}
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              max={9999}
              value={config.seed}
              onChange={(e) => setConfig({ seed: Math.max(0, parseInt(e.target.value) || 0) })}
              disabled={isRunning}
              className="w-full rounded-lg border border-primary-100 bg-primary-50/50 px-3 py-1.5 text-sm font-medium text-primary-700 outline-none focus:border-primary disabled:opacity-50"
            />
            <button
              onClick={() => setConfig({ seed: Math.floor(Math.random() * 9999) + 1 })}
              disabled={isRunning}
              title="Generate random seed"
              className="rounded-lg border border-primary-100 bg-primary-50 px-3 py-1.5 text-sm text-primary-500 hover:bg-primary-100 disabled:opacity-50"
            >
              🎲
            </button>
            <button
              onClick={() => setConfig({ seed: 0 })}
              disabled={isRunning}
              title="Use random each time"
              className="rounded-lg border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs text-primary-400 hover:bg-primary-100 disabled:opacity-50"
            >
              ∞
            </button>
          </div>
          {config.seed !== 0 && (
            <p className="mt-1 text-[10px] text-accent-dark">
              ✓ Reproducible — same seed always gives same results
            </p>
          )}
          {config.seed === 0 && (
            <p className="mt-1 text-[10px] text-primary-400">
              Results will vary between runs
            </p>
          )}
        </div>

        {/* Compare toggle */}
        <div className="flex items-center justify-between rounded-xl bg-primary-50/50 p-3">
          <span className="text-sm font-medium text-primary-700">Compare with Random</span>
          <button
            onClick={() => setCompareWithRandom(!compareWithRandom)}
            disabled={isRunning}
            className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
              compareWithRandom ? 'bg-accent' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                compareWithRandom ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Run / Cancel button */}
        {!isRunning ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={runGA}
            disabled={!hasData}
            className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dark px-4 py-3 font-body text-sm font-bold text-white shadow-md transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
          >
            🚀 Run Algorithm
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={cancelGA}
            className="w-full rounded-xl bg-gradient-to-r from-warning to-warning-dark px-4 py-3 font-body text-sm font-bold text-white shadow-md transition-all"
          >
            ⏹ Cancel
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  disabled: boolean;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-primary-400">{label}</label>
        <span className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="slider-thumb h-2 w-full cursor-pointer appearance-none rounded-full bg-primary-100 accent-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
