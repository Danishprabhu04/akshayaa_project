import { motion } from 'framer-motion';
import { Heart, Shield, Zap, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/Card';
import Modal from '../components/Modal';
import { useStore } from '../state/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'patient' | 'doctor';
}

function AuthModal({ isOpen, onClose, role }: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useStore();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      login(role, formData.name, formData.email);
      onClose();
      navigate(role === 'patient' ? '/patient/home' : '/doctor/dashboard');
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${role === 'patient' ? 'Patient' : 'Doctor'} Login`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleInputChange('name')}
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl focus-ring text-text-primary"
          />
          {errors.name && <p className="text-sm text-error-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl focus-ring text-text-primary"
          />
          {errors.email && <p className="text-sm text-error-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl focus-ring text-text-primary"
          />
          {errors.password && <p className="text-sm text-error-600 mt-1">{errors.password}</p>}
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-white/30 rounded-xl text-text-primary hover:bg-white/10 focus-ring"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 focus-ring"
          >
            Continue
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function Landing() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; role: 'patient' | 'doctor' }>({
    isOpen: false,
    role: 'patient',
  });

  const openAuthModal = (role: 'patient' | 'doctor') => {
    setAuthModal({ isOpen: true, role });
  };

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze skin conditions with high accuracy',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your health data is encrypted and protected with enterprise-grade security',
    },
    {
      icon: Users,
      title: 'Expert Review',
      description: 'Board-certified dermatologists review all AI assessments for accuracy',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-accent-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-xl"
              >
                <Heart className="h-12 w-12 text-white" />
              </motion.div>
              <h1 className="text-5xl font-bold text-text-primary">SkinVision</h1>
            </div>
            
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Advanced AI-powered skin analysis combined with expert dermatologist review. 
              Get professional insights about your skin health from the comfort of your home.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('patient')}
                className="flex items-center justify-center px-8 py-4 bg-primary-500 text-white rounded-2xl font-semibold shadow-xl hover:bg-primary-600 focus-ring transition-all"
              >
                Continue as Patient
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('doctor')}
                className="flex items-center justify-center px-8 py-4 glass-strong border border-white/20 text-text-primary rounded-2xl font-semibold shadow-xl hover:bg-white/20 focus-ring transition-all"
              >
                Continue as Doctor
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                >
                  <Card hover className="h-full">
                    <CardBody className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-text-primary mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {feature.description}
                      </p>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="glass-strong rounded-3xl p-12 max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-8">
              Trusted by Healthcare Professionals
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                <div className="text-text-secondary">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
                <div className="text-text-secondary">Analyses Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">200+</div>
                <div className="text-text-secondary">Expert Dermatologists</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        role={authModal.role}
      />
    </div>
  );
}