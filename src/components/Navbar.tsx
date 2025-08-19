import { motion } from 'framer-motion';
import { Menu, User, LogOut, Heart } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../state/store';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="glass-strong sticky top-0 z-40 border-b border-white/20 backdrop-blur-2xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-text-primary hover:bg-white/10 focus-ring lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center ml-4 lg:ml-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-text-primary">SkinVision</h1>
              </motion.div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${user.role === 'doctor' 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-accent-100 text-accent-800'
                  }
                `}>
                  {user.role === 'doctor' ? 'Doctor' : 'Patient'}
                </span>
                
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 focus-ring"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-text-primary hidden sm:block">
                      {user.name}
                    </span>
                  </button>

                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-xl border border-white/20 overflow-hidden"
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-sm font-medium text-text-primary">{user.name}</p>
                          <p className="text-xs text-text-secondary">{user.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-text-primary hover:bg-white/10 focus-ring"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}