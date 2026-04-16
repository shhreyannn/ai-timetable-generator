// ── Domain Types ──

export interface Teacher {
  id: string;
  name: string;
  subjects: string[]; // subject IDs this teacher can teach
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  hoursPerWeek: number;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface Timeslot {
  id: string;
  day: string;
  period: number;
  label: string;
  shift: 'morning' | 'afternoon'; // which shift this slot belongs to
}

export interface ClassGroup {
  id: string;
  name: string;
  subjects: string[];
  allowedRooms: string[];      // dedicated room(s) for this class
  allowedTimeslots: string[];  // shift-specific timeslot IDs
}

// ── Genetic Algorithm Types ──

export interface Gene {
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
  timeslotId: string;
}

export type Chromosome = Gene[];

export type GAAlgorithmType = 'standard' | 'steady-state' | 'adaptive-mutation';

export interface GAConfig {
  populationSize: number;
  generations: number;
  mutationRate: number;
  tournamentSize: number;
  crossoverType: 'one-point' | 'two-point';
  algorithmType: GAAlgorithmType;
  seed: number; // for reproducible results (0 = random)
}

export interface GenerationMetrics {
  generation: number;
  bestFitness: number;
  averageFitness: number;
  worstFitness: number;
  conflicts: number;
  mutationRate?: number;
}

export interface ConflictDetail {
  type: 'teacher' | 'room' | 'subject-repeat' | 'gap' | 'class';
  description: string;
  genes: Gene[];
}

export interface GAResult {
  bestTimetable: Chromosome;
  initialFitness: number;
  finalFitness: number;
  initialConflicts: number;
  finalConflicts: number;
  generationMetrics: GenerationMetrics[];
  executionTimeMs: number;
  conflictDetails: ConflictDetail[];
}

export interface RandomResult {
  timetable: Chromosome;
  fitness: number;
  conflicts: number;
  conflictDetails: ConflictDetail[];
}

// ── Input Data ──

export interface InputData {
  teachers: Teacher[];
  subjects: Subject[];
  rooms: Room[];
  timeslots: Timeslot[];
  classes: ClassGroup[];
}

// ── Worker Messages ──

export interface GAWorkerMessage {
  type: 'start';
  config: GAConfig;
  inputData: InputData;
}

export interface GAWorkerProgress {
  type: 'progress';
  metrics: GenerationMetrics;
  currentBest: Chromosome;
  currentBestConflicts?: ConflictDetail[];
}

export interface GAWorkerComplete {
  type: 'complete';
  result: GAResult;
}

export interface GAWorkerError {
  type: 'error';
  message: string;
}

export type GAWorkerResponse = GAWorkerProgress | GAWorkerComplete | GAWorkerError;
