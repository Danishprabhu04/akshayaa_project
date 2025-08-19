import { motion, AnimatePresence } from 'framer-motion';
import { Home, Upload, FileText, MessageCircle, Shield, BarChart3, Inbox, CheckCircle, Settings, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../state/store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const patientNavItems = [
  { href: '/patient/home', label: 'Home', icon: Home },
  { href: '/patient/upload', label: 'Upload', icon: Upload },
  { href: '/patient/reports', label: 'My Reports', icon: FileText },
  { href: '/patient/privacy', label: 'Privacy', icon: Shield },
];

const doctorNavItems = [
  { href: '/doctor/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/doctor/submissions', label: 'Submissions', icon: Inbox },
  { href: '/doctor/verified', label: 'Verified Reports', icon: CheckCircle },
  { href: '/doctor/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, sidebarCollapsed } = useStore();
  const location = useLocation();

  const navItems = user?.role === 'doctor' ? doctorNavItems : patientNavItems;

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const itemVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -20, opacity: 0 },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen
          glass-strong border-r border-white/20 backdrop-blur-2xl
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
          lg:translate-x-0 transform transition-all duration-300 ease-in-out
        `}
        style={{ height: '100vh', paddingTop: '4rem' }}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md text-text-primary hover:bg-white/10 focus-ring lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6" />
        </button>

        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <motion.div
                key={item.href}
                variants={itemVariants}
                initial="closed"
                animate="open"
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    focus-ring group
                    ${isActive
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-text-primary hover:bg-white/10 hover:text-primary-600'
                    }
                  `}
                >
                  <Icon className={`
                    h-5 w-5 flex-shrink-0
                    ${sidebarCollapsed ? '' : 'mr-3'}
                  `} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  
                  {isActive && !sidebarCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* Chatbot for patients */}
        {user?.role === 'patient' && (
          <div className="absolute bottom-4 left-4 right-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <h3 className="text-sm font-medium text-text-primary">Need Help?</h3>
                    <p className="text-xs text-text-secondary">Chat with our AI assistant</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </motion.aside>
    </>
  );
}