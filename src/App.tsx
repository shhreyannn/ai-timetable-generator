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
        <div className="flex min-h-screen items-center justify-center bg-secondary p-8">
          <div className="rounded-card bg-white p-8 shadow-card">
            <h2 className="font-heading text-xl font-bold text-warning">Something went wrong</h2>
            <p className="mt-2 font-body text-sm text-primary-400">{this.state.error}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: '' });
                window.location.reload();
              }}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm text-white"
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

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Header />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-6 lg:col-span-3"
          >
            <InputPanel />
            <ControlsPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-6 lg:col-span-9"
          >
            <ProgressIndicator />
            <FitnessChart />
            <TimetableGrid />
            <ResultsPanel />
            <ExportButton />
          </motion.div>
        </div>


      </div>
    </ErrorBoundary>
  );
}

export default App;
