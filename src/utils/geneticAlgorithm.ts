/**
 * Genetic Algorithm for Timetable Optimization
 *
 * Supports three variants:
 *   - Standard GA: generational replacement with elitism
 *   - Steady-State GA: replace only the worst individuals each generation
 *   - Adaptive Mutation GA: mutation rate decreases as fitness improves
 *
 * Uses a seeded PRNG (mulberry32) so results are reproducible when seed ≠ 0.
 */

import {
  Gene,
  Chromosome,
  GAConfig,
  GAResult,
  GenerationMetrics,
  InputData,
  ConflictDetail,
  Teacher,
} from './types';

// ── Seeded PRNG (mulberry32) ──────────────────────────────────────────────────
// Returns a PRNG function that produces values in [0, 1).
// When seed === 0 we fall back to Math.random for truly random runs.

function makePRNG(seed: number): () => number {
  if (seed === 0) return Math.random.bind(Math);
  let s = seed >>> 0;
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Module-level random function, reset before each run.
let rng: () => number = Math.random;

function randInt(max: number) { return Math.floor(rng() * max); }
function randElement<T>(arr: T[]): T { return arr[randInt(arr.length)]; }

// ── Teacher helper ────────────────────────────────────────────────────────────

function findTeacherForSubject(subjectId: string, teachers: Teacher[]): Teacher {
  const eligible = teachers.filter(t => t.subjects.includes(subjectId));
  return eligible.length > 0 ? randElement(eligible) : randElement(teachers);
}

// ── Chromosome factory ────────────────────────────────────────────────────────

function createChromosome(inputData: InputData): Chromosome {
  const { classes, subjects, teachers, rooms, timeslots } = inputData;
  const genes: Chromosome = [];
  for (const cls of classes) {
    // Use class-specific allowed rooms/timeslots if defined, else fall back to all
    const eligibleRooms = cls.allowedRooms?.length
      ? rooms.filter(r => cls.allowedRooms.includes(r.id))
      : rooms;
    const eligibleTimeslots = cls.allowedTimeslots?.length
      ? timeslots.filter(t => cls.allowedTimeslots.includes(t.id))
      : timeslots;

    for (const subjectId of cls.subjects) {
      const subject = subjects.find(s => s.id === subjectId);
      if (!subject) continue;
      for (let i = 0; i < subject.hoursPerWeek; i++) {
        genes.push({
          classId: cls.id,
          subjectId,
          teacherId: findTeacherForSubject(subjectId, teachers).id,
          roomId: randElement(eligibleRooms).id,
          timeslotId: randElement(eligibleTimeslots).id,
        });
      }
    }
  }
  return genes;
}

export function initializePopulation(size: number, inputData: InputData): Chromosome[] {
  return Array.from({ length: size }, () => createChromosome(inputData));
}

// ── Fitness function (penalty-based) ─────────────────────────────────────────

export interface FitnessBreakdown {
  teacherConflicts: number;
  roomConflicts: number;
  subjectRepetitions: number;
  scheduleGaps: number;
  totalPenalty: number;
  fitness: number;
  conflictDetails: ConflictDetail[];
}

export function evaluateFitness(chromosome: Chromosome, inputData: InputData): FitnessBreakdown {
  let penalty = 0;
  let teacherConflicts = 0;
  let roomConflicts = 0;
  let subjectRepetitions = 0;
  let scheduleGaps = 0;
  const conflictDetails: ConflictDetail[] = [];

  // Group by timeslot
  const byTimeslot = new Map<string, Gene[]>();
  for (const g of chromosome) {
    const arr = byTimeslot.get(g.timeslotId) ?? [];
    arr.push(g);
    byTimeslot.set(g.timeslotId, arr);
  }

  for (const genes of byTimeslot.values()) {
    // Teacher conflicts
    const tMap = new Map<string, Gene[]>();
    for (const g of genes) { const a = tMap.get(g.teacherId) ?? []; a.push(g); tMap.set(g.teacherId, a); }
    for (const tGenes of tMap.values()) {
      if (tGenes.length > 1 && new Set(tGenes.map(g => g.classId)).size > 1) {
        const c = tGenes.length - 1;
        teacherConflicts += c; penalty += c * 10;
        conflictDetails.push({ type: 'teacher', description: `Teacher double-booked (×${tGenes.length})`, genes: tGenes });
      }
    }
    // Room conflicts
    const rMap = new Map<string, Gene[]>();
    for (const g of genes) { const a = rMap.get(g.roomId) ?? []; a.push(g); rMap.set(g.roomId, a); }
    for (const rGenes of rMap.values()) {
      if (rGenes.length > 1 && new Set(rGenes.map(g => g.classId)).size > 1) {
        const c = rGenes.length - 1;
        roomConflicts += c; penalty += c * 10;
        conflictDetails.push({ type: 'room', description: `Room double-booked (×${rGenes.length})`, genes: rGenes });
      }
    }
    // Class double-booking
    const cMap = new Map<string, Gene[]>();
    for (const g of genes) { const a = cMap.get(g.classId) ?? []; a.push(g); cMap.set(g.classId, a); }
    for (const cGenes of cMap.values()) {
      if (cGenes.length > 1) { 
        const c = cGenes.length - 1; teacherConflicts += c; penalty += c * 10;
        conflictDetails.push({ type: 'class', description: `Class double-booked in same period`, genes: cGenes });
      }
    }
  }

  // Subject repetition per day per class
  const classDayGenes = new Map<string, Map<string, Gene[]>>();
  for (const g of chromosome) {
    const ts = inputData.timeslots.find(t => t.id === g.timeslotId);
    if (!ts) continue;
    const key = g.classId;
    if (!classDayGenes.has(key)) classDayGenes.set(key, new Map());
    const dm = classDayGenes.get(key)!;
    const arr = dm.get(ts.day) ?? [];
    arr.push(g);
    dm.set(ts.day, arr);
  }
  for (const dm of classDayGenes.values()) {
    for (const [day, dayGenes] of dm.entries()) {
      const freq = new Map<string, Gene[]>();
      for (const g of dayGenes) {
        const a = freq.get(g.subjectId) ?? [];
        a.push(g);
        freq.set(g.subjectId, a);
      }
      for (const [s, subGenes] of freq.entries()) {
        if (subGenes.length > 2) { 
          const e = subGenes.length - 2; subjectRepetitions += e; penalty += e * 5;
          conflictDetails.push({ 
            type: 'subject-repeat', 
            description: `Subject ${s} repeats >2 times on ${day}`, 
            genes: subGenes 
          });
        }
      }
    }
  }

  // Schedule gaps per class per day
  for (const cls of inputData.classes) {
    const dm = new Map<string, Gene[]>();
    for (const g of chromosome) {
      if (g.classId !== cls.id) continue;
      const ts = inputData.timeslots.find(t => t.id === g.timeslotId);
      if (!ts) continue;
      const arr = dm.get(ts.day) ?? [];
      arr.push(g);
      dm.set(ts.day, arr);
    }
    for (const [day, dayGenes] of dm.entries()) {
      const periods = dayGenes
        .map(g => inputData.timeslots.find(t => t.id === g.timeslotId)?.period ?? -1)
        .filter(p => p !== -1)
        .sort((a, b) => a - b);
        
      let hasGap = false;
      let dayGaps = 0;
      for (let i = 1; i < periods.length; i++) {
        const gap = periods[i] - periods[i - 1] - 1;
        if (gap > 0) { dayGaps += gap; hasGap = true; }
      }
      if (hasGap) {
         scheduleGaps += dayGaps; penalty += dayGaps * 2;
         conflictDetails.push({
           type: 'gap',
           description: `Schedule gap of ${dayGaps} period(s) on ${day}`,
           genes: dayGenes
         });
      }
    }
  }

  // Dynamic base score: scales with chromosome length so fitness is always meaningful
  // regardless of how many classes/subjects are in the dataset.
  // With 600 genes, baseScore = 12000, giving room to show real improvement.
  const baseScore = Math.max(1000, chromosome.length * 20);

  return {
    teacherConflicts, roomConflicts, subjectRepetitions, scheduleGaps,
    totalPenalty: penalty,
    fitness: Math.max(0, baseScore - penalty),
    conflictDetails,
  };
}

// ── Selection ─────────────────────────────────────────────────────────────────

function tournamentSelect(population: Chromosome[], fitnesses: number[], k: number): Chromosome {
  let best = randInt(population.length);
  for (let i = 1; i < k; i++) {
    const idx = randInt(population.length);
    if (fitnesses[idx] > fitnesses[best]) best = idx;
  }
  return population[best].map(g => ({ ...g }));
}

// ── Crossover ─────────────────────────────────────────────────────────────────

function crossover(p1: Chromosome, p2: Chromosome, type: 'one-point' | 'two-point'): [Chromosome, Chromosome] {
  const len = Math.min(p1.length, p2.length);
  if (len < 3) return [p1.map(g => ({ ...g })), p2.map(g => ({ ...g }))];

  // Align crossover points to class boundaries so we don't rupture a class's internal schedule,
  // preventing massive schedule gaps and subject repetitions in the offspring.
  const class0Id = p1[0]?.classId;
  let genesPerClass = 0;
  while (genesPerClass < len && p1[genesPerClass].classId === class0Id) {
    genesPerClass++;
  }
  const numClasses = Math.floor(len / genesPerClass);

  if (type === 'one-point') {
    // Split at a class boundary (between 1 and numClasses - 1)
    const ptClass = 1 + randInt(Math.max(1, numClasses - 1));
    const pt = ptClass * genesPerClass;
    
    return [
      [...p1.slice(0, pt).map(g => ({ ...g })), ...p2.slice(pt).map(g => ({ ...g }))],
      [...p2.slice(0, pt).map(g => ({ ...g })), ...p1.slice(pt).map(g => ({ ...g }))],
    ];
  } else {
    let aClass = randInt(numClasses + 1);
    let bClass = randInt(numClasses + 1);
    if (aClass > bClass) [aClass, bClass] = [bClass, aClass];
    if (aClass === bClass) bClass = Math.min(bClass + 1, numClasses);
    
    const a = aClass * genesPerClass;
    const b = bClass * genesPerClass;
    
    return [
      [...p1.slice(0, a).map(g => ({ ...g })), ...p2.slice(a, b).map(g => ({ ...g })), ...p1.slice(b).map(g => ({ ...g }))],
      [...p2.slice(0, a).map(g => ({ ...g })), ...p1.slice(a, b).map(g => ({ ...g })), ...p2.slice(b).map(g => ({ ...g }))],
    ];
  }
}

// ── Mutation ──────────────────────────────────────────────────────────────────

function mutate(chromosome: Chromosome, rate: number, inputData: InputData): Chromosome {
  const classMap = new Map(inputData.classes.map(c => [c.id, c]));

  // The UI rate (e.g., 0.15) is scaled down. 
  // If we actually mutated 15% of ~500 genes, it's too destructive (75 genes scrambled).
  // Scaling by 0.1 means 0.15 becomes 1.5% chance per gene (~7 genes mutate), which is perfect.
  const geneRate = rate * 0.1;

  return chromosome.map(g => {
    if (rng() >= geneRate) return { ...g };
    const cls = classMap.get(g.classId);

    // Respect class constraints during mutation
    const eligibleRooms = cls?.allowedRooms?.length
      ? inputData.rooms.filter(r => cls.allowedRooms.includes(r.id))
      : inputData.rooms;
    const eligibleTimeslots = cls?.allowedTimeslots?.length
      ? inputData.timeslots.filter(t => cls.allowedTimeslots.includes(t.id))
      : inputData.timeslots;

    const choice = randInt(3);
    if (choice === 0) return { ...g, timeslotId: randElement(eligibleTimeslots).id };
    if (choice === 1) return { ...g, roomId: randElement(eligibleRooms).id };
    return { ...g, teacherId: findTeacherForSubject(g.subjectId, inputData.teachers).id };
  });
}

// ── Metrics snapshot ──────────────────────────────────────────────────────────

function snapshot(gen: number, population: Chromosome[], fitnesses: FitnessBreakdown[]): GenerationMetrics {
  const vals = fitnesses.map(f => f.fitness);
  const best = Math.max(...vals);
  const bestf = fitnesses[vals.indexOf(best)];
  return {
    generation: gen,
    bestFitness: best,
    averageFitness: vals.reduce((a, b) => a + b, 0) / vals.length,
    worstFitness: Math.min(...vals),
    conflicts: bestf.teacherConflicts + bestf.roomConflicts + bestf.subjectRepetitions + bestf.scheduleGaps,
  };
}

// ── Yield helper ──────────────────────────────────────────────────────────────

const yieldToBrowser = () => new Promise<void>(r => setTimeout(r, 0));

// ── Synchronous run (for unit tests) ─────────────────────────────────────────

export function runGeneticAlgorithm(
  config: GAConfig,
  inputData: InputData,
  onProgress?: (m: GenerationMetrics, best: Chromosome) => void
): GAResult {
  rng = makePRNG(config.seed);
  const startTime = performance.now();
  let pop = initializePopulation(config.populationSize, inputData);
  let fitnesses = pop.map(c => evaluateFitness(c, inputData));
  const metrics: GenerationMetrics[] = [];

  const initBestIdx = fitnesses.reduce((bi, f, i) => f.fitness > fitnesses[bi].fitness ? i : bi, 0);
  const initialFitness = fitnesses[initBestIdx].fitness;
  const ib = fitnesses[initBestIdx];
  const initialConflicts = ib.teacherConflicts + ib.roomConflicts + ib.subjectRepetitions + ib.scheduleGaps;

  for (let gen = 0; gen < config.generations; gen++) {
    const m = snapshot(gen, pop, fitnesses);
    metrics.push(m);
    if (onProgress) onProgress(m, pop[fitnesses.map(f => f.fitness).indexOf(m.bestFitness)]);
    [pop, fitnesses] = evolve(pop, fitnesses, config, inputData, m);
  }

  return buildResult(pop, fitnesses, metrics, initialFitness, initialConflicts, startTime);
}

// ── Async run (for UI — yields between generations) ───────────────────────────

export async function runGeneticAlgorithmAsync(
  config: GAConfig,
  inputData: InputData,
  onProgress: (m: GenerationMetrics, best: Chromosome) => void,
  cancelledRef: { current: boolean }
): Promise<GAResult> {
  rng = makePRNG(config.seed);
  const startTime = performance.now();
  let pop = initializePopulation(config.populationSize, inputData);
  let fitnesses = pop.map(c => evaluateFitness(c, inputData));
  const metrics: GenerationMetrics[] = [];

  const initBestIdx = fitnesses.reduce((bi, f, i) => f.fitness > fitnesses[bi].fitness ? i : bi, 0);
  const initialFitness = fitnesses[initBestIdx].fitness;
  const ib = fitnesses[initBestIdx];
  const initialConflicts = ib.teacherConflicts + ib.roomConflicts + ib.subjectRepetitions + ib.scheduleGaps;

  for (let gen = 0; gen < config.generations; gen++) {
    if (cancelledRef.current) break;

    const m = snapshot(gen, pop, fitnesses);
    metrics.push(m);
    onProgress(m, pop[fitnesses.map(f => f.fitness).indexOf(m.bestFitness)]);

    await yieldToBrowser(); // keep UI alive

    [pop, fitnesses] = evolve(pop, fitnesses, config, inputData, m);
  }

  return buildResult(pop, fitnesses, metrics, initialFitness, initialConflicts, startTime);
}

// ── Core evolution step (dispatches to algorithm variant) ────────────────────

function evolve(
  pop: Chromosome[],
  fitnesses: FitnessBreakdown[],
  config: GAConfig,
  inputData: InputData,
  currentMetrics: GenerationMetrics,
): [Chromosome[], FitnessBreakdown[]] {
  switch (config.algorithmType) {
    case 'steady-state':
      return evolveSteadyState(pop, fitnesses, config, inputData);
    case 'adaptive-mutation':
      return evolveAdaptive(pop, fitnesses, config, inputData, currentMetrics);
    default:
      return evolveStandard(pop, fitnesses, config, inputData);
  }
}

// ── Standard Generational GA ──────────────────────────────────────────────────
// Full replacement each generation with elitism (best individual survives).

function evolveStandard(
  pop: Chromosome[],
  fitnesses: FitnessBreakdown[],
  config: GAConfig,
  inputData: InputData,
): [Chromosome[], FitnessBreakdown[]] {
  const vals = fitnesses.map(f => f.fitness);
  const bestIdx = vals.indexOf(Math.max(...vals));
  const next: Chromosome[] = [pop[bestIdx].map(g => ({ ...g }))]; // elitism

  while (next.length < config.populationSize) {
    const p1 = tournamentSelect(pop, vals, config.tournamentSize);
    const p2 = tournamentSelect(pop, vals, config.tournamentSize);
    const [c1, c2] = crossover(p1, p2, config.crossoverType);
    next.push(mutate(c1, config.mutationRate, inputData));
    if (next.length < config.populationSize) next.push(mutate(c2, config.mutationRate, inputData));
  }

  return [next, next.map(c => evaluateFitness(c, inputData))];
}

// ── Steady-State GA ───────────────────────────────────────────────────────────
// Each generation, produce 2 offspring; replace the 2 worst individuals if offspring are better.

function evolveSteadyState(
  pop: Chromosome[],
  fitnesses: FitnessBreakdown[],
  config: GAConfig,
  inputData: InputData,
): [Chromosome[], FitnessBreakdown[]] {
  const newPop = pop.map(c => c.map(g => ({ ...g })));
  const newFit = [...fitnesses];
  const vals = fitnesses.map(f => f.fitness);

  // Replaces worst individuals each generation. We do 50% of the population
  // so it has enough evaluations per generation to keep pace with Standard GA.
  const replacements = Math.max(2, Math.floor(config.populationSize * 0.5));
  for (let r = 0; r < replacements; r += 2) {
    const p1 = tournamentSelect(pop, vals, config.tournamentSize);
    const p2 = tournamentSelect(pop, vals, config.tournamentSize);
    const [c1, c2] = crossover(p1, p2, config.crossoverType);
    const off1 = mutate(c1, config.mutationRate, inputData);
    const off2 = mutate(c2, config.mutationRate, inputData);
    const f1 = evaluateFitness(off1, inputData);
    const f2 = evaluateFitness(off2, inputData);

    // Find worst slot to replace
    const currentVals = newFit.map(f => f.fitness);
    const worst1 = currentVals.indexOf(Math.min(...currentVals));
    if (f1.fitness > newFit[worst1].fitness) {
      newPop[worst1] = off1; newFit[worst1] = f1;
    }
    if (r + 1 < replacements) {
      const currentVals2 = newFit.map(f => f.fitness);
      const worst2 = currentVals2.indexOf(Math.min(...currentVals2));
      if (f2.fitness > newFit[worst2].fitness) {
        newPop[worst2] = off2; newFit[worst2] = f2;
      }
    }
  }

  return [newPop, newFit];
}

// ── Adaptive Mutation GA ──────────────────────────────────────────────────────
// Mutation rate increases when population stagnates, decreases when improving.
// Starts at config.mutationRate, bounded in [0.01, 0.5].

let _prevBestFitness = -1;
let _stagnationCount = 0;
let _currentAdaptiveMutation = 0.1;

function evolveAdaptive(
  pop: Chromosome[],
  fitnesses: FitnessBreakdown[],
  config: GAConfig,
  inputData: InputData,
  metrics: GenerationMetrics,
): [Chromosome[], FitnessBreakdown[]] {
  // Initialize on first call (gen 0)
  if (metrics.generation === 0) {
    _prevBestFitness = metrics.bestFitness;
    _stagnationCount = 0;
    _currentAdaptiveMutation = config.mutationRate;
  }

  // Adapt mutation rate using Pulse Mutation to prevent Death Spirals
  const bestFit = metrics.bestFitness;
  if (bestFit > _prevBestFitness) {
    _stagnationCount = 0;
    _prevBestFitness = bestFit;
    // Cool down gracefully as we find better solutions
    _currentAdaptiveMutation = Math.max(0.02, _currentAdaptiveMutation * 0.95); 
  } else {
    _stagnationCount++;
    // Every 5 stagnant generations, send a heat pulse to shock it out of the local trap
    if (_stagnationCount % 5 === 0) {
      _currentAdaptiveMutation = Math.min(0.3, _currentAdaptiveMutation * 1.5);
    } else {
      // Otherwise, keep cooling down so the offspring actually survive the shock
      _currentAdaptiveMutation = Math.max(0.02, _currentAdaptiveMutation * 0.95);
    }
  }

  // Run standard generational cycle with adapted rate
  const vals = fitnesses.map(f => f.fitness);
  const bestIdx = vals.indexOf(Math.max(...vals));
  const next: Chromosome[] = [pop[bestIdx].map(g => ({ ...g }))];

  while (next.length < config.populationSize) {
    const p1 = tournamentSelect(pop, vals, config.tournamentSize);
    const p2 = tournamentSelect(pop, vals, config.tournamentSize);
    const [c1, c2] = crossover(p1, p2, config.crossoverType);
    next.push(mutate(c1, _currentAdaptiveMutation, inputData));
    if (next.length < config.populationSize) next.push(mutate(c2, _currentAdaptiveMutation, inputData));
  }

  return [next, next.map(c => evaluateFitness(c, inputData))];
}

// ── Build final result ────────────────────────────────────────────────────────

function buildResult(
  pop: Chromosome[],
  fitnesses: FitnessBreakdown[],
  metrics: GenerationMetrics[],
  initialFitness: number,
  initialConflicts: number,
  startTime: number,
): GAResult {
  const vals = fitnesses.map(f => f.fitness);
  const bestIdx = vals.indexOf(Math.max(...vals));
  const fb = fitnesses[bestIdx];

  return {
    bestTimetable: pop[bestIdx],
    initialFitness,
    finalFitness: fb.fitness,
    initialConflicts,
    finalConflicts: fb.teacherConflicts + fb.roomConflicts + fb.subjectRepetitions + fb.scheduleGaps,
    generationMetrics: metrics,
    executionTimeMs: performance.now() - startTime,
    conflictDetails: fb.conflictDetails,
  };
}
