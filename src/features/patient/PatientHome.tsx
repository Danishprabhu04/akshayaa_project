import { motion } from 'framer-motion';
import { Upload, FileText, MessageCircle, TrendingUp, Calendar, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { KPICard } from '../../components/Card';
import { useStore } from '../../state/store';

export default function PatientHome() {
  const { user, reports } = useStore();
  
  const recentReports = reports.slice(0, 3);
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const approvedReports = reports.filter(r => r.status === 'approved').length;

  const quickActions = [
    {
      icon: Upload,
      title: 'New Skin Check',
      description: 'Upload a photo for AI analysis',
      to: '/patient/upload',
      color: 'primary' as const,
    },
    {
      icon: FileText,
      title: 'View Reports',
      description: 'Check your analysis results',
      to: '/patient/reports',
      color: 'success' as const,
    },
    {
      icon: MessageCircle,
      title: 'Ask Questions',
      description: 'Chat with our AI assistant',
      onClick: () => {
        // Chatbot will be available via floating widget
      },
      color: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-text-secondary mt-2">
              Stay on top of your skin health with regular check-ups
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <KPICard
          title="Total Reports"
          value={reports.length}
          icon={FileText}
          color="primary"
        />
        <KPICard
          title="Pending Review"
          value={pendingReports}
          icon={Calendar}
          color="warning"
        />
        <KPICard
          title="Approved"
          value={approvedReports}
          icon={Shield}
          color="success"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const Component = action.to ? Link : 'button';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              >
                <Component
                  to={action.to}
                  onClick={action.onClick}
                  className="block w-full"
                >
                  <Card hover className="h-full">
                    <CardBody className="text-center">
                      <div className={`
                        w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
                        ${action.color === 'primary' ? 'bg-gradient-to-br from-primary-500 to-accent-500' :
                          action.color === 'success' ? 'bg-gradient-to-br from-success-500 to-green-600' :
                          'bg-gradient-to-br from-warning-500 to-orange-600'}
                      `}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {action.description}
                      </p>
                    </CardBody>
                  </Card>
                </Component>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Recent Reports</h2>
          <Link
            to="/patient/reports"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
          </Link>
        </div>

        {recentReports.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No Reports Yet
              </h3>
              <p className="text-text-secondary mb-4">
                Upload your first skin image to get started with AI analysis
              </p>
              <Link to="/patient/upload">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 focus-ring"
                >
                  Start Skin Check
                </motion.button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4">
            {recentReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
              >
                <Card hover>
                  <CardBody>
                    <div className="flex items-center space-x-4">
                      <img
                        src={report.thumbnail}
                        alt="Skin analysis"
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-text-primary">
                            {report.condition}
                          </h3>
                          <span className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${report.status === 'approved' ? 'bg-success-100 text-success-800' :
                              report.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                              'bg-error-100 text-error-800'}
                          `}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm mt-1">
                          {new Date(report.dateISO).toLocaleDateString()} • {report.confidence}% confidence
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}