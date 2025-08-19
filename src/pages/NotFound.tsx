import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-accent-50/20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-8xl font-bold text-primary-500">404</div>
        </motion.div>
        
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Page Not Found
        </h1>
        
        <p className="text-text-secondary mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-full px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold shadow-lg hover:bg-primary-600 focus-ring transition-colors"
            >
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="flex items-center justify-center w-full px-6 py-3 glass-strong border border-white/20 text-text-primary rounded-xl font-semibold hover:bg-white/20 focus-ring transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}