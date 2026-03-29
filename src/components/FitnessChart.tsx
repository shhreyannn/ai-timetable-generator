import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '../store/useStore';

export default function FitnessChart() {
  const { generationMetrics } = useStore();

  if (generationMetrics.length === 0) return null;

  // Downsample if too many points
  const data = generationMetrics.length > 200
    ? generationMetrics.filter((_, i) => i % Math.ceil(generationMetrics.length / 200) === 0)
    : generationMetrics;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="rounded-card bg-[#131314]/60 backdrop-blur-xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]-hover"
    >
      <h2 className="mb-4 font-heading text-lg font-semibold text-white">
        📈 Fitness Evolution
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8F0FE" />
          <XAxis
            dataKey="generation"
            tick={{ fontSize: 11, fill: '#1F3A5F' }}
            label={{ value: 'Generation', position: 'bottom', offset: -5, fontSize: 12, fill: '#1F3A5F' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: '#1F3A5F' }}
            label={{ value: 'Fitness', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#1F3A5F' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: '#E53935' }}
            label={{ value: 'Conflicts', angle: 90, position: 'insideRight', fontSize: 12, fill: '#E53935' }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #E8F0FE',
              boxShadow: '0 4px 6px rgba(31,58,95,0.1)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
            }}
            labelStyle={{ fontWeight: 600, color: '#1F3A5F' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="bestFitness"
            name="Best Fitness"
            stroke="#4CAF50"
            strokeWidth={2.5}
            dot={false}
            animationDuration={1500}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="averageFitness"
            name="Avg Fitness"
            stroke="#6366f1"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
            animationDuration={1500}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="conflicts"
            name="Conflicts"
            stroke="#E53935"
            strokeWidth={1.5}
            dot={false}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
