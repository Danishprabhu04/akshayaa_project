import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Shell from '../layouts/Shell';
import {
  PatientHome,
  PatientUpload,
  PatientReports,
  PatientPrivacy,
} from '../features/patient';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

export default function PatientApp() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Navigate to="/patient/home" replace />} />
        <Route 
          path="/home" 
          element={
            <AnimatedPage>
              <PatientHome />
            </AnimatedPage>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <AnimatedPage>
              <PatientUpload />
            </AnimatedPage>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <AnimatedPage>
              <PatientReports />
            </AnimatedPage>
          } 
        />
        <Route 
          path="/privacy" 
          element={
            <AnimatedPage>
              <PatientPrivacy />
            </AnimatedPage>
          } 
        />
        <Route path="*" element={<Navigate to="/patient/home" replace />} />
      </Routes>
    </Shell>
  );
}