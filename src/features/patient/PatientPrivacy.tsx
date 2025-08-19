import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../../components/Card';

export default function PatientPrivacy() {
  const privacyFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All your medical images and data are encrypted with bank-level security standards.',
    },
    {
      icon: Eye,
      title: 'Limited Access',
      description: 'Only certified dermatologists and authorized medical professionals can view your data.',
    },
    {
      icon: Database,
      title: 'Secure Storage',
      description: 'Your data is stored in HIPAA-compliant servers with regular security audits.',
    },
    {
      icon: UserCheck,
      title: 'Your Control',
      description: 'You have full control over your data and can request deletion at any time.',
    },
  ];

  const gdprRights = [
    'Right to access your personal data',
    'Right to rectify inaccurate information',
    'Right to erase your data',
    'Right to restrict processing',
    'Right to data portability',
    'Right to object to processing',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy & Data Protection</h1>
          <p className="text-text-secondary">
            Your privacy and data security are our top priorities
          </p>
        </div>
      </motion.div>

      {/* Privacy Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-text-primary mb-6">How We Protect Your Data</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {privacyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              >
                <Card hover className="h-full">
                  <CardBody>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-text-secondary">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* HIPAA Compliance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-text-primary">HIPAA Compliance</h2>
          </CardHeader>
          <CardBody>
            <div className="prose prose-primary max-w-none">
              <p className="text-text-secondary leading-relaxed mb-4">
                SkinVision is fully compliant with the Health Insurance Portability and 
                Accountability Act (HIPAA). This means:
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Your protected health information (PHI) is safeguarded at all times
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  We use minimum necessary standards when accessing your data
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  All staff undergo regular HIPAA training and background checks
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  We maintain detailed audit logs of all data access
                </li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* GDPR Rights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-text-primary">Your Rights Under GDPR</h2>
          </CardHeader>
          <CardBody>
            <p className="text-text-secondary mb-4">
              As a user, you have the following rights regarding your personal data:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {gdprRights.map((right, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-accent-50 rounded-xl"
                >
                  <FileText className="h-5 w-5 text-accent-600 flex-shrink-0" />
                  <span className="text-sm text-text-primary">{right}</span>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Data Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-text-primary">How We Use Your Data</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="bg-primary-50 rounded-xl p-4">
                <h4 className="font-semibold text-text-primary mb-2">🎯 Primary Use</h4>
                <p className="text-text-secondary text-sm">
                  Your skin images and data are used solely for providing AI-powered skin analysis 
                  and connecting you with qualified dermatologists for medical review.
                </p>
              </div>
              
              <div className="bg-success-50 rounded-xl p-4">
                <h4 className="font-semibold text-text-primary mb-2">📊 Anonymous Research</h4>
                <p className="text-text-secondary text-sm">
                  With your explicit consent, anonymized data may be used to improve our AI models 
                  and advance dermatological research. Personal identifiers are always removed.
                </p>
              </div>
              
              <div className="bg-warning-50 rounded-xl p-4">
                <h4 className="font-semibold text-text-primary mb-2">🚫 What We Don't Do</h4>
                <p className="text-text-secondary text-sm">
                  We never sell your data to third parties, use it for advertising purposes, 
                  or share it without your explicit consent except as required by law.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 pt-8"
      >
        <Link to="/patient/upload" className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 focus-ring"
          >
            Start Secure Analysis
          </motion.button>
        </Link>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // Mock contact functionality
            window.open('mailto:privacy@skinvision.com', '_blank');
          }}
          className="flex-1 px-6 py-3 glass-strong border border-white/20 text-text-primary rounded-xl font-semibold hover:bg-white/20 focus-ring"
        >
          Contact Privacy Team
        </motion.button>
      </motion.div>
    </div>
  );
}