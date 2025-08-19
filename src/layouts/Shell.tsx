import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ToastContainer from '../components/Toast';
import ChatbotWidget from '../components/ChatbotWidget';
import { useStore } from '../state/store';

export default function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, setSidebarCollapsed } = useStore();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setSidebarOpen(false);
        setSidebarCollapsed(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarCollapsed]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-accent-50/20">
      <Navbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 lg:ml-0"
        >
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </motion.main>
      </div>

      {/* Show chatbot only for patients */}
      {user?.role === 'patient' && <ChatbotWidget />}
      
      <ToastContainer />
    </div>
  );
}