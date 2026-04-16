import { create } from 'zustand';
import type {
  InputData,
  GAConfig,
  GAResult,
  RandomResult,
  GenerationMetrics,
  Chromosome,
  ConflictDetail,
} from '../utils/types';
import { getSampleData } from '../utils/sampleData';
import { generateRandomTimetable } from '../utils/randomScheduler';

interface TimetableStore {
  inputData: InputData;
  setInputData: (data: InputData) => void;
  loadPreset: () => void;

  config: GAConfig;
  setConfig: (config: Partial<GAConfig>) => void;

  isRunning: boolean;
  currentGeneration: number;
  currentBestFitness: number;
  currentBest: Chromosome | null;
  currentBestConflicts: ConflictDetail[];
  generationMetrics: GenerationMetrics[];

  result: GAResult | null;
  randomResult: RandomResult | null;
  compareWithRandom: boolean;
  setCompareWithRandom: (v: boolean) => void;

  showConflicts: boolean;
  setShowConflicts: (v: boolean) => void;

  selectedClassId: string;
  setSelectedClassId: (id: string) => void;

  startGA: () => void;
  onProgress: (metrics: GenerationMetrics, best: Chromosome, conflicts?: ConflictDetail[]) => void;
  onComplete: (result: GAResult) => void;
  onError: (message: string) => void;
  reset: () => void;

  activeSeed: number | null;
  setActiveSeed: (seed: number) => void;

  error: string | null;
}

export const useStore = create<TimetableStore>((set, get) => ({
  inputData: {
    teachers: [],
    subjects: [],
    rooms: [],
    timeslots: [],
    classes: [],
  },
  setInputData: (data) => set({ inputData: data, selectedClassId: data.classes[0]?.id || '' }),
  loadPreset: () => {
    const data = getSampleData();
    set({ inputData: data, selectedClassId: data.classes[0]?.id || '' });
  },

  config: {
    populationSize: 100,
    generations: 400,
    mutationRate: 0.15,
    tournamentSize: 5,
    crossoverType: 'two-point',
    algorithmType: 'adaptive-mutation',
    seed: 3,
  },
  setConfig: (partial) =>
    set((state) => ({ config: { ...state.config, ...partial } })),

  isRunning: false,
  currentGeneration: 0,
  currentBestFitness: 0,
  currentBest: null,
  currentBestConflicts: [],
  generationMetrics: [],

  result: null,
  randomResult: null,
  compareWithRandom: false,
  setCompareWithRandom: (v) => set({ compareWithRandom: v }),

  showConflicts: false,
  setShowConflicts: (v) => set({ showConflicts: v }),

  selectedClassId: '',
  setSelectedClassId: (id) => set({ selectedClassId: id }),

  activeSeed: null,
  setActiveSeed: (seed) => set({ activeSeed: seed }),

  error: null,

  startGA: () => {
    const state = get();
    set({
      isRunning: true,
      currentGeneration: 0,
      currentBestFitness: 0,
      currentBest: null,
      currentBestConflicts: [],
      generationMetrics: [],
      result: null,
      randomResult: null,
      error: null,
      activeSeed: null,
    });

    if (state.compareWithRandom) {
      const randomResult = generateRandomTimetable(state.inputData);
      set({ randomResult });
    }
  },

  onProgress: (metrics, best, conflicts) => {
    set((state) => ({
      currentGeneration: metrics.generation,
      currentBestFitness: metrics.bestFitness,
      currentBest: best,
      currentBestConflicts: conflicts || [],
      generationMetrics: [...state.generationMetrics, metrics],
    }));
  },

  onComplete: (result) =>
    set((state) => ({
      isRunning: false,
      result,
      currentGeneration: result.generationMetrics.length,
      currentBestFitness: result.finalFitness,
      generationMetrics: result.generationMetrics,
      selectedClassId: state.selectedClassId || get().inputData.classes[0]?.id || '',
    })),

  onError: (message) =>
    set({
      isRunning: false,
      error: message,
    }),

  reset: () =>
    set({
      isRunning: false,
      currentGeneration: 0,
      currentBestFitness: 0,
      currentBest: null,
      currentBestConflicts: [],
      generationMetrics: [],
      result: null,
      randomResult: null,
      error: null,
    }),
}));
