import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Shell from '../layouts/Shell';
import {
  DoctorDashboard,
  DoctorSubmissions,
  DoctorVerified,
  DoctorSettings,
} from '../features/doctor';

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

export default function DoctorApp() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Navigate to="/doctor/dashboard" replace />} />
        <Route 
          path="/dashboard" 
          element={
            <AnimatedPage>
              <DoctorDashboard />
            </AnimatedPage>
          } 
        />
        <Route 
          path="/submissions" 
          element={
            <AnimatedPage>
              <DoctorSubmissions />
            </AnimatedPage>
          } 
        />
        <Route 
          path="/verified" 
          element={
            <AnimatedPage>
              <DoctorVerified />
            </AnimatedPage>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <AnimatedPage>
              <DoctorSettings />
            </AnimatedPage>
          } 
        />
        <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
      </Routes>
    </Shell>
  );
}