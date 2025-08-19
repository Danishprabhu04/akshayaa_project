import { motion } from 'framer-motion';
import { Inbox, CheckCircle, XCircle, Clock, TrendingUp, Users, Calendar, Activity } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { KPICard } from '../../components/Card';
import { useStore } from '../../state/store';

export default function DoctorDashboard() {
  const { user, submissions, activity } = useStore();
  
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
  const approvedSubmissions = submissions.filter(s => s.status === 'approved').length;
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected').length;
  
  const recentActivity = activity.slice(0, 5);

  // Mock chart data - in a real app this would come from an API
  const weeklySubmissions = [12, 19, 15, 17, 14, 21, 18]; // Last 7 days
  const chartMaxValue = Math.max(...weeklySubmissions);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Good morning, Dr. {user?.name?.split(' ').pop()}! 👋
        </h1>
        <p className="text-text-secondary">
          Here's your patient submission overview for today
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KPICard
          title="New Submissions"
          value={pendingSubmissions}
          icon={Inbox}
          color="warning"
          change={pendingSubmissions > 0 ? `${pendingSubmissions} pending` : 'All caught up'}
          changeType={pendingSubmissions > 0 ? 'neutral' : 'positive'}
        />
        <KPICard
          title="Approved Today"
          value={approvedSubmissions}
          icon={CheckCircle}
          color="success"
          change="+12% from yesterday"
          changeType="positive"
        />
        <KPICard
          title="Rejected"
          value={rejectedSubmissions}
          icon={XCircle}
          color="error"
          change="2 this week"
          changeType="neutral"
        />
        <KPICard
          title="Total Reviews"
          value={totalSubmissions}
          icon={TrendingUp}
          color="primary"
          change="+23% this month"
          changeType="positive"
        />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-text-primary">Weekly Submissions</h2>
              <p className="text-sm text-text-secondary">Last 7 days overview</p>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {/* Simple Bar Chart */}
                <div className="flex items-end justify-between h-32 space-x-2">
                  {weeklySubmissions.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / chartMaxValue) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="flex flex-col items-center flex-1"
                    >
                      <div className="w-full bg-gradient-to-t from-primary-500 to-accent-500 rounded-t-lg min-h-[4px]">
                      </div>
                      <span className="text-xs text-text-secondary mt-2">
                        {weekDays[index]}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                    <span className="text-text-secondary">Submissions</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">Recent Activity</h2>
                <Activity className="h-5 w-5 text-text-secondary" />
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-text-secondary text-center py-8">
                    No recent activity
                  </p>
                ) : (
                  recentActivity.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                      className="flex items-start space-x-3 p-3 bg-white/20 rounded-xl"
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${item.type === 'submission' ? 'bg-warning-100' :
                          item.type === 'review' ? 'bg-primary-100' :
                          'bg-success-100'}
                      `}>
                        {item.type === 'submission' ? (
                          <Inbox className="h-4 w-4 text-warning-600" />
                        ) : item.type === 'review' ? (
                          <Clock className="h-4 w-4 text-primary-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-success-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-text-primary">{item.message}</p>
                        <p className="text-xs text-text-secondary mt-1">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card hover onClick={() => window.location.href = '/doctor/submissions'}>
            <CardBody className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-warning-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Inbox className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Review Submissions
              </h3>
              <p className="text-sm text-text-secondary">
                {pendingSubmissions} pending reviews
              </p>
            </CardBody>
          </Card>

          <Card hover onClick={() => window.location.href = '/doctor/verified'}>
            <CardBody className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Verified Reports
              </h3>
              <p className="text-sm text-text-secondary">
                View completed reviews
              </p>
            </CardBody>
          </Card>

          <Card hover onClick={() => window.location.href = '/doctor/settings'}>
            <CardBody className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Profile Settings
              </h3>
              <p className="text-sm text-text-secondary">
                Update preferences
              </p>
            </CardBody>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}