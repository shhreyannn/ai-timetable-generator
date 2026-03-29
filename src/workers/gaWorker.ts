/**
 * Web Worker for Genetic Algorithm execution.
 * Runs the GA off the main thread to keep the UI responsive.
 */

import { runGeneticAlgorithm } from '../utils/geneticAlgorithm';
import type { GAWorkerMessage, GAWorkerResponse, GenerationMetrics, Chromosome } from '../utils/types';

self.onmessage = (event: MessageEvent<GAWorkerMessage>) => {
  const { config, inputData } = event.data;

  try {
    const result = runGeneticAlgorithm(
      config,
      inputData,
      (metrics: GenerationMetrics, currentBest: Chromosome) => {
        const progress: GAWorkerResponse = {
          type: 'progress',
          metrics,
          currentBest,
        };
        self.postMessage(progress);
      }
    );

    const complete: GAWorkerResponse = {
      type: 'complete',
      result,
    };
    self.postMessage(complete);
  } catch (error) {
    const err: GAWorkerResponse = {
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    self.postMessage(err);
  }
};
