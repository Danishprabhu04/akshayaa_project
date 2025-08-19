import { motion } from 'framer-motion';
import { FileText, Search, Download, Eye, Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/Card';
import Modal from '../../components/Modal';
import ProgressBar from '../../components/ProgressBar';
import EmptyState from '../../components/EmptyState';
import { useStore } from '../../state/store';
import type { Report } from '../../data/mock';

interface ReportModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
}

function ReportModal({ report, isOpen, onClose }: ReportModalProps) {
  if (!report) return null;

  const handleDownload = () => {
    // Mock download functionality
    useStore.getState().addToast({
      type: 'info',
      message: 'PDF download available in connected services',
      duration: 3000,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Analysis Report" size="lg">
      <div className="space-y-6">
        {/* Image and Basic Info */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <img
              src={report.thumbnail}
              alt="Skin analysis"
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
          <div className="md:w-1/2 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {report.condition}
              </h3>
              <p className="text-text-secondary text-sm">
                Analyzed on {new Date(report.dateISO).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">Confidence Level</span>
                <span className="text-sm text-text-secondary">{report.confidence}%</span>
              </div>
              <ProgressBar
                value={report.confidence}
                color={report.confidence > 80 ? 'success' : report.confidence > 60 ? 'warning' : 'error'}
                size="lg"
                animate
              />
            </div>

            <div>
              <span className={`
                inline-flex px-3 py-1 rounded-full text-sm font-medium
                ${report.status === 'approved' ? 'bg-success-100 text-success-800' :
                  report.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                  'bg-error-100 text-error-800'}
              `}>
                {report.status === 'approved' ? 'Reviewed & Approved' :
                 report.status === 'pending' ? 'Pending Review' :
                 'Needs Follow-up'}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {report.recommendations && (
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-3">
              Recommendations
            </h4>
            <div className="space-y-2">
              {report.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-primary-50 rounded-xl"
                >
                  <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-text-primary">{rec}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor Notes */}
        {report.doctorNotes && (
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-3">
              Doctor's Notes
            </h4>
            <div className="bg-accent-50 rounded-xl p-4">
              <p className="text-text-primary">{report.doctorNotes}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 focus-ring"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex items-center justify-center px-6 py-3 glass-strong border border-white/20 text-text-primary rounded-xl font-medium hover:bg-white/20 focus-ring"
          >
            Close
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}

export default function PatientReports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { reports } = useStore();

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.doctorNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         '';
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">My Reports</h1>
        <p className="text-text-secondary">
          View and manage your skin analysis reports
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card>
          <CardBody>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-primary placeholder-text-secondary focus-ring"
                  />
                </div>
              </div>
              <div className="lg:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-primary focus-ring"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Reports Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {filteredReports.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                icon={FileText}
                title={searchQuery || statusFilter !== 'all' ? "No matching reports" : "No reports yet"}
                description={
                  searchQuery || statusFilter !== 'all'
                    ? "Try adjusting your search or filters"
                    : "Upload your first skin image to get started with AI analysis"
                }
                action={
                  !searchQuery && statusFilter === 'all'
                    ? {
                        label: "Start Skin Check",
                        onClick: () => window.location.href = '/patient/upload',
                      }
                    : undefined
                }
              />
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              >
                <Card hover>
                  <CardBody>
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Thumbnail */}
                      <div className="lg:w-32 lg:h-32">
                        <img
                          src={report.thumbnail}
                          alt="Skin analysis"
                          className="w-full h-32 lg:w-32 lg:h-32 object-cover rounded-xl"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-text-primary mb-2">
                              {report.condition}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-text-secondary">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(report.dateISO).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                {report.confidence}% confidence
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                            <span className={`
                              px-3 py-1 rounded-full text-sm font-medium
                              ${report.status === 'approved' ? 'bg-success-100 text-success-800' :
                                report.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                                'bg-error-100 text-error-800'}
                            `}>
                              {report.status}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewReport(report)}
                              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 focus-ring text-sm font-medium"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Report
                            </motion.button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <ProgressBar
                            value={report.confidence}
                            color={report.confidence > 80 ? 'success' : report.confidence > 60 ? 'warning' : 'error'}
                            size="sm"
                            showValue={false}
                          />
                        </div>

                        {/* Summary */}
                        {report.doctorNotes && (
                          <p className="text-sm text-text-secondary line-clamp-2">
                            <span className="font-medium">Doctor's note:</span> {report.doctorNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Report Modal */}
      <ReportModal
        report={selectedReport}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}