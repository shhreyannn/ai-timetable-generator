import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function ExportButton() {
  const { result } = useStore();

  const exportTimetable = useCallback(async (format: 'png' | 'pdf') => {
    const element = document.getElementById('timetable-grid');
    if (!element) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = 'timetable.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('timetable.pdf');
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, []);

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="flex gap-3"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => exportTimetable('png')}
        className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary-700 px-4 py-3 font-body text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
      >
        📷 Export as PNG
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => exportTimetable('pdf')}
        className="flex-1 rounded-xl bg-gradient-to-r from-primary-700 to-primary-800 px-4 py-3 font-body text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
      >
        📄 Export as PDF
      </motion.button>
    </motion.div>
  );
}
