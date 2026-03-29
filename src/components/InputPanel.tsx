import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function InputPanel() {
  const { inputData, loadPreset } = useStore();
  const hasData = inputData.teachers.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-card bg-[#131314]/60 backdrop-blur-xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]-hover"
    >
      <h2 className="mb-4 font-heading text-lg font-semibold text-white">
        📋 Input Data
      </h2>

      <div className="space-y-4">
        {/* Preset button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={loadPreset}
          className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-700 px-4 py-3 font-body text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
        >
          ⚡ Load Sample Dataset
        </motion.button>

        {hasData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Teachers */}
            <DataSection
              title="Teachers"
              icon="👨‍🏫"
              count={inputData.teachers.length}
              items={inputData.teachers.map(t => (
                <div key={t.id} className="flex items-center justify-between rounded-lg bg-[#1a191b]/80 border border-white/5 px-3 py-2">
                  <span className="text-sm font-medium text-primary-700">{t.name}</span>
                  <span className="text-xs text-[#adaaab]">
                    {t.subjects.length} subject{t.subjects.length > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            />

            {/* Subjects */}
            <DataSection
              title="Subjects"
              icon="📚"
              count={inputData.subjects.length}
              items={inputData.subjects.map(s => (
                <div key={s.id} className="flex items-center gap-2 rounded-lg bg-[#1a191b]/80 border border-white/5 px-3 py-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm font-medium text-primary-700">{s.name}</span>
                  <span className="ml-auto text-xs text-[#adaaab]">{s.hoursPerWeek}h/wk</span>
                </div>
              ))}
            />

            {/* Rooms */}
            <DataSection
              title="Rooms"
              icon="🏫"
              count={inputData.rooms.length}
              items={inputData.rooms.map(r => (
                <div key={r.id} className="flex items-center justify-between rounded-lg bg-[#1a191b]/80 border border-white/5 px-3 py-2">
                  <span className="text-sm font-medium text-primary-700">{r.name}</span>
                  <span className="text-xs text-[#adaaab]">Cap: {r.capacity}</span>
                </div>
              ))}
            />

            {/* Classes */}
            <DataSection
              title="Classes"
              icon="🎓"
              count={inputData.classes.length}
              items={inputData.classes.map(c => (
                <div key={c.id} className="flex items-center justify-between rounded-lg bg-[#1a191b]/80 border border-white/5 px-3 py-2">
                  <span className="text-sm font-medium text-primary-700">{c.name}</span>
                  <span className="text-xs text-[#adaaab]">{c.subjects.length} subjects</span>
                </div>
              ))}
            />

            {/* Timeslots summary */}
            <div className="rounded-xl border border-white/5 bg-[#1a191b] border border-white/5/30 p-3">
              <div className="flex items-center gap-2">
                <span>🕐</span>
                <span className="text-sm font-semibold text-primary-700">Timeslots</span>
                <span className="ml-auto rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-600">
                  {inputData.timeslots.length} slots
                </span>
              </div>
              <p className="mt-1 text-xs text-[#adaaab]">
                {[...new Set(inputData.timeslots.map(t => t.day))].length} days ×{' '}
                {inputData.timeslots.length / [...new Set(inputData.timeslots.map(t => t.day))].length} periods/day
              </p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                  ☀️ Morning: {inputData.timeslots.filter(t => t.shift === 'morning').length / [...new Set(inputData.timeslots.map(t => t.day))].length} per day
                </span>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                  🌙 Afternoon: {inputData.timeslots.filter(t => t.shift === 'afternoon').length / [...new Set(inputData.timeslots.map(t => t.day))].length} per day
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {!hasData && (
          <p className="text-center text-sm text-gray-400">
            Load the sample dataset to get started
          </p>
        )}
      </div>
    </motion.div>
  );
}

function DataSection({
  title,
  icon,
  count,
  items,
}: {
  title: string;
  icon: string;
  count: number;
  items: React.ReactNode[];
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#1a191b] border border-white/5/30 p-3">
      <div className="mb-2 flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-sm font-semibold text-primary-700">{title}</span>
        <span className="ml-auto rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-600">
          {count}
        </span>
      </div>
      <div className="max-h-32 space-y-1 overflow-y-auto">{items}</div>
    </div>
  );
}
