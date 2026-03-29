import { Suspense, lazy, Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ControlsPanel from './components/ControlsPanel';
import ProgressIndicator from './components/ProgressIndicator';
import FitnessChart from './components/FitnessChart';
import TimetableGrid from './components/TimetableGrid';
import ResultsPanel from './components/ResultsPanel';
import ExportButton from './components/ExportButton';

const ThreeBackground = lazy(() => import('./components/ThreeBackground'));

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0e0e0f] p-8">
          <div className="rounded-card bg-[#131314]/60 backdrop-blur-xl border border-white/10 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <h2 className="font-heading text-xl font-bold text-[#ff716c]">Something went wrong</h2>
            <p className="mt-2 font-body text-sm text-[#adaaab]">{this.state.error}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: '' });
                window.location.reload();
              }}
              className="mt-4 rounded-xl bg-gradient-to-br from-[#8ff5ff] to-[#00eefc] text-[#0e0e0f] font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(143,245,255,0.4)] transition-all px-4 py-2 text-sm text-white"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { useStore } from './store/useStore';

function App() {
  const { isRunning, generationMetrics } = useStore();
  const hasStarted = isRunning || generationMetrics.length > 0;

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>

      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8 xl:px-12 2xl:px-24">
        <Header />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-6 lg:col-span-3 xl:col-span-3"
          >
            <InputPanel />
            <ControlsPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-6 lg:col-span-9 xl:col-span-9"
          >
            {hasStarted ? (
              <>
                <ProgressIndicator />
                <FitnessChart />
                <TimetableGrid />
                <ResultsPanel />
                <ExportButton />
              </>
            ) : (
              <div className="flex h-full min-h-[600px] flex-col items-center justify-center rounded-card border-2 border-dashed border-white/10 bg-[#131314]/60 backdrop-blur-xl border border-white/10 p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100/50 text-5xl">
                  🚀
                </div>
                <h3 className="font-heading text-2xl font-bold text-white">
                  Ready to optimize your schedules
                </h3>
                <p className="mt-3 max-w-lg text-[#adaaab]">
                  Load an existing problem dataset or enter constraints manually, then select your algorithm parameters and click <span className="font-semibold text-white">Run Algorithm</span>. The progress and final optimized timetables will appear here.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
