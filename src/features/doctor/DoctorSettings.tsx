import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Stethoscope, Bell, Save, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { useStore } from '../../state/store';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  location: string;
  license: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  urgentCases: boolean;
}

export default function DoctorSettings() {
  const { user, addToast } = useStore();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    specialty: 'Dermatology',
    location: 'San Francisco, CA',
    license: 'CA-12345',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: false,
    urgentCases: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleProfileSave = async () => {
    setIsLoading(true);
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addToast({
      type: 'success',
      message: 'Profile updated successfully',
      duration: 3000,
    });
    setIsLoading(false);
  };

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleProfileChange = (field: keyof ProfileData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfileData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const specialties = [
    'Dermatology',
    'Dermatopathology',
    'Pediatric Dermatology',
    'Dermatologic Surgery',
    'Cosmetic Dermatology',
    'Mohs Surgery',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary">
          Manage your profile and notification preferences
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary">Profile Information</h2>
              </div>
            </CardHeader>
            <CardBody>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                      <input
                        type="text"
                        id="name"
                        value={profileData.name}
                        onChange={handleProfileChange('name')}
                        className="w-full pl-10 pr-3 py-2 bg-white/20 border border-white/30 rounded-xl text-text-primary focus-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                      <input
                        type="email"
                        id="email"
                        value={profileData.email}
                        onChange={handleProfileChange('email')}
                        className="w-full pl-10 pr-3 py-2 bg-white/20 border border-white/30 rounded-xl text-text-primary focus-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                      <input
                        type="tel"
                        id="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange('phone')}
                        className="w-full pl-10 pr-3 py-2 bg-white/20 border border-white/30 rounded-xl text-text-primary focus-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="specialty" className="block text-sm font-medium text-text-primary mb-2">
                      Specialty
                    </label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                      <select
                        id="specialty"
                        value={profileData.specialty}
                        onChange={handleProfileChange('specialty')}
                        className="w-full pl-10 pr-3 py-2 bg-white/20 border border-white/30 rounded-xl text-text-primary focus-ring"
                      >
                        {specialties.map(specialty => (
                          <option key={specialty} value={specialty}>
                            {specialty}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                      <input
                        type="text"
                        id="location"
                        value={profileData.location}
                        onChange={handleProfileChange('location')}
                        className="w-full pl-10 pr-3 py-2 bg-white/20 border border-white/30 rounded-xl text-text-primary focus-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="license" className="block text-sm font-medium text-text-primary mb-2">
                      Medical License
                    </label>
                    <input
                      type="text"
                      id="license"
                      value={profileData.license}
                      onChange={handleProfileChange('license')}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-text-primary focus-ring"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProfileSave}
                  disabled={isLoading}
                  className="flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 focus-ring disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </form>
            </CardBody>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                  <Bell className="h-5 w-5 text-accent-600" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary">Notifications</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value], index) => {
                  const labels = {
                    emailNotifications: 'Email Notifications',
                    pushNotifications: 'Push Notifications',
                    weeklyReports: 'Weekly Summary',
                    urgentCases: 'Urgent Cases Alert',
                  };

                  const descriptions = {
                    emailNotifications: 'Receive notifications via email',
                    pushNotifications: 'Browser push notifications',
                    weeklyReports: 'Weekly activity summary',
                    urgentCases: 'Immediate alerts for urgent cases',
                  };

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/10 rounded-xl"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-text-primary">
                          {labels[key as keyof NotificationSettings]}
                        </h4>
                        <p className="text-xs text-text-secondary">
                          {descriptions[key as keyof NotificationSettings]}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(key as keyof NotificationSettings)}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          ${value ? 'bg-primary-500' : 'bg-gray-300'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition
                            ${value ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6"
          >
            <Card>
              <CardBody>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-success-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Account Status
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Your account is verified and in good standing
                  </p>
                  <div className="mt-4 space-y-2 text-xs text-text-secondary">
                    <div className="flex justify-between">
                      <span>License Status:</span>
                      <span className="text-success-600 font-medium">Verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Login:</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}