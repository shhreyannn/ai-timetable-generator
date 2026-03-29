import { useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';
import { runGeneticAlgorithmAsync } from '../utils/geneticAlgorithm';

/**
 * Runs the GA asynchronously, yielding to the browser between generations
 * so the UI shows real-time progress (chart, progress bar, etc).
 */
export function useGAWorker() {
  const cancelledRef = useRef({ current: false });
  const runningRef = useRef(false);

  const runGA = useCallback(() => {
    const { config, inputData, startGA, onProgress, onComplete, onError } = useStore.getState();

    // Validate input
    if (
      inputData.teachers.length === 0 ||
      inputData.subjects.length === 0 ||
      inputData.rooms.length === 0 ||
      inputData.timeslots.length === 0 ||
      inputData.classes.length === 0
    ) {
      onError('Please load data first (teachers, subjects, rooms, timeslots, classes).');
      return;
    }

    if (runningRef.current) return;
    runningRef.current = true;
    cancelledRef.current = { current: false };
    startGA();

    // Run async GA - yields between generations
    runGeneticAlgorithmAsync(config, inputData, onProgress, cancelledRef.current)
      .then((result) => {
        if (!cancelledRef.current.current) {
          onComplete(result);
        }
      })
      .catch((error) => {
        if (!cancelledRef.current.current) {
          onError(error instanceof Error ? error.message : 'Unknown error');
        }
      })
      .finally(() => {
        runningRef.current = false;
      });
  }, []);

  const cancelGA = useCallback(() => {
    cancelledRef.current.current = true;
    runningRef.current = false;
    useStore.getState().onError('Algorithm cancelled by user.');
  }, []);

  return { runGA, cancelGA };
}
