import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { Gene } from '../utils/types';

export default function TimetableGrid() {
  const { result, inputData, showConflicts, setShowConflicts, selectedClassId, setSelectedClassId } = useStore();

  const days = useMemo(
    () => [...new Set(inputData.timeslots.map(t => t.day))],
    [inputData.timeslots]
  );

  // Show only periods relevant to the selected class's shift
  const periods = useMemo(() => {
    const cls = inputData.classes.find(c => c.id === selectedClassId);
    let relevantSlots = inputData.timeslots;
    if (cls?.allowedTimeslots?.length) {
      relevantSlots = inputData.timeslots.filter(t => cls.allowedTimeslots.includes(t.id));
    }
    const day0 = days[0];
    const daySlots = relevantSlots.filter(t => t.day === day0);
    return daySlots.map(t => t.period).sort((a, b) => a - b);
  }, [inputData.timeslots, inputData.classes, selectedClassId, days]);

  // Filter genes for selected class
  const classGenes = useMemo(() => {
    if (!result) return [];
    if (!selectedClassId) return result.bestTimetable;
    return result.bestTimetable.filter(g => g.classId === selectedClassId);
  }, [result, selectedClassId]);

  // Build grid lookup
  const geneGrid = useMemo(() => {
    const grid = new Map<string, Gene[]>();
    for (const gene of classGenes) {
      const ts = inputData.timeslots.find(t => t.id === gene.timeslotId);
      if (!ts) continue;
      const key = `${ts.day}_${ts.period}`;
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key)!.push(gene);
    }
    return grid;
  }, [classGenes, inputData.timeslots]);

  // Find conflicts
  const conflictSet = useMemo(() => {
    const conflicts = new Set<string>();
    if (!showConflicts || !result) return conflicts;
    for (const detail of result.conflictDetails) {
      for (const gene of detail.genes) {
        if (selectedClassId && gene.classId !== selectedClassId) continue;
        const ts = inputData.timeslots.find(t => t.id === gene.timeslotId);
        if (ts) conflicts.add(`${ts.day}_${ts.period}`);
      }
    }
    return conflicts;
  }, [result, showConflicts, inputData.timeslots, selectedClassId]);

  // Find classes that have conflicts
  const conflictingClasses = useMemo(() => {
    const classIds = new Set<string>();
    if (!result) return classIds;
    for (const detail of result.conflictDetails) {
      for (const gene of detail.genes) {
        classIds.add(gene.classId);
      }
    }
    return classIds;
  }, [result]);

  // Early return AFTER all hooks
  if (!result) return null;

  const getTimeslotLabel = (day: string, period: number) => {
    const ts = inputData.timeslots.find(t => t.day === day && t.period === period);
    return ts?.label || `P${period}`;
  };

  const getSubject = (id: string) => inputData.subjects.find(s => s.id === id);
  const getTeacher = (id: string) => inputData.teachers.find(t => t.id === id);
  const getRoom = (id: string) => inputData.rooms.find(r => r.id === id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-card bg-white p-6 shadow-card"
      id="timetable-grid"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-primary">
          📅 Generated Timetable
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Class selector */}
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="rounded-lg border border-primary-100 bg-primary-50/50 px-3 py-1.5 text-sm font-medium text-primary-700 outline-none focus:border-primary"
          >
            {inputData.classes.map(c => {
              const hasConflict = conflictingClasses.has(c.id);
              const label = showConflicts && hasConflict ? `🔴 ${c.name} (Conflicts)` : c.name;
              return (
                <option key={c.id} value={c.id}>{label}</option>
              );
            })}
          </select>

          {/* Conflict toggle */}
          <button
            onClick={() => setShowConflicts(!showConflicts)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              showConflicts
                ? 'bg-warning text-white shadow-md'
                : 'bg-warning/10 text-warning hover:bg-warning/20'
            }`}
          >
            {showConflicts ? '🔴 Conflicts ON' : '⭕ Show Conflicts'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="rounded-tl-lg bg-primary-50 p-2 text-xs font-semibold text-primary-600">
                Day / Period
              </th>
              {periods.map((p) => (
                <th
                  key={p}
                  className="bg-primary-50 p-2 text-center text-xs font-semibold text-primary-600 last:rounded-tr-lg"
                >
                  {getTimeslotLabel(days[0], p)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dayIdx) => (
              <tr key={day}>
                <td className="border-t border-primary-50 bg-primary-50/30 p-2 text-xs font-semibold text-primary-700">
                  {day}
                </td>
                {periods.map((period, pIdx) => {
                  const key = `${day}_${period}`;
                  const genes = geneGrid.get(key) || [];
                  const isConflict = conflictSet.has(key);

                  return (
                    <motion.td
                      key={key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: dayIdx * 0.05 + pIdx * 0.03,
                        duration: 0.3,
                      }}
                      className={`border-t border-primary-50 p-1 ${
                        isConflict ? 'bg-warning/10' : ''
                      }`}
                    >
                      {genes.length > 0 ? (
                        genes.map((gene, gi) => {
                          const subject = getSubject(gene.subjectId);
                          const teacher = getTeacher(gene.teacherId);
                          const room = getRoom(gene.roomId);

                          return (
                            <div
                              key={gi}
                              className={`rounded-lg p-2 text-center transition-all ${
                                isConflict
                                  ? 'ring-2 ring-warning ring-offset-1'
                                  : 'hover:shadow-md'
                              }`}
                              style={{
                                backgroundColor: subject
                                  ? `${subject.color}18`
                                  : '#f3f4f6',
                                borderLeft: `3px solid ${subject?.color || '#9ca3af'}`,
                              }}
                            >
                              <p
                                className="text-xs font-bold"
                                style={{ color: subject?.color || '#1F3A5F' }}
                              >
                                {subject?.name || gene.subjectId}
                              </p>
                              <p className="mt-0.5 text-[10px] text-gray-500">
                                {teacher?.name || gene.teacherId}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {room?.name || gene.roomId}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="rounded-lg bg-gray-50 p-2 text-center text-[10px] text-gray-300">
                          —
                        </div>
                      )}
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {inputData.subjects.map(s => (
          <div key={s.id} className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2 py-1">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[10px] font-medium text-gray-600">{s.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
