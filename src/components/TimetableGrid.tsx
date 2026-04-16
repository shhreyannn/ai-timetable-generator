import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { Gene, ConflictDetail, Timeslot } from '../utils/types';

export default function TimetableGrid() {
  const { 
    result, 
    currentBest, 
    currentBestConflicts, 
    inputData, 
    showConflicts, 
    setShowConflicts, 
    selectedClassId, 
    setSelectedClassId 
  } = useStore();

  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  
  const days = useMemo(
    () => [...new Set(inputData.timeslots.map(t => t.day))],
    [inputData.timeslots]
  );
  
  const [selectedDay, setSelectedDay] = useState<string>(days[0] || 'Monday');

  const visibleDays = viewMode === 'week' ? days : [selectedDay];

  const activeTimetable = result?.bestTimetable || currentBest;
  const activeConflicts = result?.conflictDetails || currentBestConflicts;

  const classGenes = useMemo(() => {
    if (!activeTimetable) return [];
    if (!selectedClassId) return activeTimetable;
    return activeTimetable.filter(g => g.classId === selectedClassId);
  }, [activeTimetable, selectedClassId]);

  const timeslotMap = useMemo(() => {
    const map = new Map<string, Timeslot>();
    for (const t of inputData.timeslots) map.set(t.id, t);
    return map;
  }, [inputData.timeslots]);

  // grid: Record<day, Record<timeslotId, Gene[]>>
  const geneGrid = useMemo(() => {
    const grid: Record<string, Record<string, Gene[]>> = {};
    for (const gene of classGenes) {
      const ts = timeslotMap.get(gene.timeslotId);
      if (!ts) continue;
      if (!grid[ts.day]) grid[ts.day] = {};
      if (!grid[ts.day][ts.id]) grid[ts.day][ts.id] = [];
      grid[ts.day][ts.id].push(gene);
    }
    return grid;
  }, [classGenes, timeslotMap]);

  const conflictMap = useMemo(() => {
    const map = new Map<string, ConflictDetail[]>();
    if (!showConflicts || !activeConflicts) return map;
    
    for (const detail of activeConflicts) {
      for (const gene of detail.genes) {
        if (selectedClassId && gene.classId !== selectedClassId) continue;
        const ts = timeslotMap.get(gene.timeslotId);
        if (!ts) continue;
        const key = `${ts.day}_${ts.id}`;
        const existing = map.get(key) || [];
        if (!existing.includes(detail)) existing.push(detail);
        map.set(key, existing);
      }
    }
    return map;
  }, [activeConflicts, showConflicts, timeslotMap, selectedClassId]);

  const conflictingClasses = useMemo(() => {
    const classIds = new Set<string>();
    if (!activeConflicts) return classIds;
    for (const detail of activeConflicts) {
      for (const gene of detail.genes) classIds.add(gene.classId);
    }
    return classIds;
  }, [activeConflicts]);

  if (!activeTimetable) return null;

  const getSubject = (id: string) => inputData.subjects.find(s => s.id === id);
  const getTeacher = (id: string) => inputData.teachers.find(t => t.id === id);
  const getRoom = (id: string) => inputData.rooms.find(r => r.id === id);

  // Extract the ordered timeslots for a generic day (for header)
  const cls = inputData.classes.find(c => c.id === selectedClassId);
  let relevantSlots = inputData.timeslots;
  if (cls?.allowedTimeslots?.length) {
    relevantSlots = inputData.timeslots.filter(t => cls.allowedTimeslots.includes(t.id));
  }
  
  // Use the layout of the first visible day to structure the columns Header
  const headerLayoutSlots = relevantSlots
    .filter(t => t.day === (visibleDays[0] || days[0]))
    .sort((a, b) => a.period - b.period);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-card bg-white p-6 shadow-card"
      id="timetable-grid"
    >
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="font-heading text-lg font-semibold text-primary flex items-center gap-2">
          📅 Timetable Preview
          {!result && currentBest && (
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
          )}
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Day / Week View Mode Toggle */}
          <div className="flex overflow-hidden rounded-lg border border-primary-100 bg-primary-50/50">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                viewMode === 'week' ? 'bg-primary text-white' : 'text-primary-600 hover:bg-primary-100'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                viewMode === 'day' ? 'bg-primary text-white' : 'text-primary-600 hover:bg-primary-100'
              }`}
            >
              Day View
            </button>
          </div>

          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="rounded-lg border border-primary-100 bg-primary-50/50 px-3 py-1.5 text-sm font-medium text-primary-700 outline-none focus:border-primary"
          >
            {inputData.classes.map(c => {
              const hasConflict = conflictingClasses.has(c.id);
              const label = showConflicts && hasConflict ? `🔴 ${c.name} (Conflicts)` : c.name;
              return <option key={c.id} value={c.id}>{label}</option>;
            })}
          </select>

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

      {viewMode === 'day' && (
        <div className="mb-4 flex flex-wrap gap-2">
          {days.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                selectedDay === d
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="overflow-x-auto pb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="rounded-tl-lg bg-primary-50 p-2 text-xs font-semibold text-primary-600 w-32">
                Day \ Time
              </th>
              {headerLayoutSlots.map((ts) => (
                <th
                  key={ts.id}
                  className="bg-primary-50 p-2 text-center text-xs font-semibold text-primary-600 last:rounded-tr-lg"
                >
                  {ts.label || `P${ts.period}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleDays.map((day) => {
              // Extract the timeslots sequentially for this exact day
              const rowSlots = relevantSlots.filter(t => t.day === day).sort((a,b) => a.period - b.period);
              
              return (
                <tr key={day}>
                  <td className="border-t border-primary-50 bg-primary-50/30 p-2 text-xs font-semibold text-primary-700">
                    {day}
                  </td>
                  {/* We map sequentially matching the header columns index, because timeslot count matches */}
                  {headerLayoutSlots.map((_, colIdx) => {
                    const cellTs = rowSlots[colIdx];
                    if (!cellTs) {
                      return <td key={`empty-${colIdx}`} className="border-t border-primary-50 p-1"></td>;
                    }

                    const mapKey = `${day}_${cellTs.id}`;
                    const genes = geneGrid[day]?.[cellTs.id] || [];
                    const cellConflicts = conflictMap.get(mapKey) || [];
                    const isConflict = cellConflicts.length > 0;

                    return (
                      <motion.td
                        key={cellTs.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`border-t border-primary-50 p-1 relative min-w-[120px] group ${
                          isConflict ? 'bg-warning/10' : ''
                        }`}
                      >
                        {genes.length > 0 ? (
                          genes.map((gene, gi) => {
                            const subject = getSubject(gene.subjectId);
                            const teacher = getTeacher(gene.teacherId);
                            const room = getRoom(gene.roomId);

                            return (
                              <motion.div
                                key={`${gi}-${gene.subjectId}-${gene.teacherId}`}
                                layoutId={`gene-${cellTs.id}-${gene.classId}-${gi}`}
                                className={`rounded-lg p-2 text-center transition-all ${
                                  isConflict
                                    ? 'ring-2 ring-warning ring-offset-1'
                                    : 'hover:shadow-md'
                                }`}
                                style={{
                                  backgroundColor: subject ? `${subject.color}18` : '#f3f4f6',
                                  borderLeft: `3px solid ${subject?.color || '#9ca3af'}`,
                                }}
                              >
                                <p className="text-xs font-bold truncate" style={{ color: subject?.color || '#1F3A5F' }}>
                                  {subject?.name || gene.subjectId}
                                </p>
                                <p className="mt-0.5 text-[10px] text-gray-500 truncate">
                                  {teacher?.name || gene.teacherId}
                                </p>
                                <p className="text-[10px] text-gray-400 truncate">
                                  {room?.name || gene.roomId}
                                </p>
                              </motion.div>
                            );
                          })
                        ) : (
                          <div className="rounded-lg bg-gray-50 p-3 text-center text-xs text-gray-300">
                            —
                          </div>
                        )}
                        
                        {/* Conflict Tooltip */}
                        {isConflict && (
                          <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 hidden w-48 group-hover:block pointer-events-none">
                            <div className="bg-white rounded-lg shadow-xl border border-warning/30 p-3 text-left">
                              <p className="text-xs font-bold text-warning mb-2 border-b border-warning/20 pb-1">
                                {cellConflicts.length} Conflict{cellConflicts.length > 1 ? 's' : ''} Found:
                              </p>
                              <ul className="space-y-1.5">
                                {cellConflicts.map((c, idx) => (
                                  <li key={idx} className="text-[10px] text-gray-700 leading-tight flex gap-1">
                                    <span className="text-warning mt-0.5">•</span>
                                    <span>{c.description}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-[6px] border-transparent border-t-white" />
                          </div>
                        )}
                      </motion.td>
                    );
                  })}
                </tr>
              );
            })}
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
