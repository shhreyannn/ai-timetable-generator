/**
 * Random Scheduler Baseline
 * 
 * Generates a completely random timetable for comparison with the GA.
 */

import { InputData, Chromosome, RandomResult, Gene } from './types';
import { evaluateFitness } from './geneticAlgorithm';

function randElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomTimetable(inputData: InputData): RandomResult {
  const { classes, subjects, teachers, rooms, timeslots } = inputData;
  const chromosome: Chromosome = [];

  for (const cls of classes) {
    const eligibleRooms = cls.allowedRooms?.length
      ? rooms.filter(r => cls.allowedRooms.includes(r.id))
      : rooms;
    const eligibleTimeslots = cls.allowedTimeslots?.length
      ? timeslots.filter(t => cls.allowedTimeslots.includes(t.id))
      : timeslots;

    for (const subjectId of cls.subjects) {
      const subject = subjects.find(s => s.id === subjectId);
      if (!subject) continue;

      for (let s = 0; s < subject.hoursPerWeek; s++) {
        const eligibleTeachers = teachers.filter(t => t.subjects.includes(subjectId));
        const teacher = eligibleTeachers.length > 0
          ? randElement(eligibleTeachers)
          : randElement(teachers);

        const gene: Gene = {
          classId: cls.id,
          subjectId,
          teacherId: teacher.id,
          roomId: randElement(eligibleRooms).id,
          timeslotId: randElement(eligibleTimeslots).id,
        };

        chromosome.push(gene);
      }
    }
  }

  const breakdown = evaluateFitness(chromosome, inputData);
  const totalConflicts = breakdown.teacherConflicts +
    breakdown.roomConflicts +
    breakdown.subjectRepetitions +
    breakdown.scheduleGaps;

  return {
    timetable: chromosome,
    fitness: breakdown.fitness,
    conflicts: totalConflicts,
    conflictDetails: breakdown.conflictDetails,
  };
}
