import { motion } from 'framer-motion';
import { Search, Filter, Eye, Clock, CheckCircle, AlertTriangle, Calendar, X } from 'lucide-react';
import { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/Card';
import Modal from '../../components/Modal';
import ProgressBar from '../../components/ProgressBar';
import Table, { type Column } from '../../components/Table';
import EmptyState from '../../components/EmptyState';
import { useStore } from '../../state/store';
import type { Submission } from '../../data/mock';

interface ReviewDrawerProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: Submission['status'], notes: string) => void;
}

function ReviewDrawer({ submission, isOpen, onClose, onSubmit }: ReviewDrawerProps) {
  const [notes, setNotes] = useState(submission?.doctorNotes || '');
  const [selectedStatus, setSelectedStatus] = useState<Submission['status']>('pending');

  if (!submission) return null;

  const handleSubmit = () => {
    if (!notes.trim()) return;
    onSubmit(selectedStatus, notes);
    onClose();
  };

  const statusOptions = [
    { value: 'approved', label: 'Approve', color: 'success' },
    { value: 'rejected', label: 'Request Re-upload', color: 'error' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Submission" size="lg">
      <div className="space-y-6">
        {/* Submission Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img
              src={submission.thumbnail}
              alt="Patient submission"
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                AI Analysis: {submission.aiLabel}
              </h3>
              <p className="text-text-secondary text-sm">
                Patient ID: {submission.patientId} •{' '}
                Submitted: {new Date(submission.dateISO).toLocaleDateString()}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">AI Confidence</span>
                <span className="text-sm text-text-secondary">{submission.confidence}%</span>
              </div>
              <ProgressBar
                value={submission.confidence}
                color={submission.confidence > 80 ? 'success' : submission.confidence > 60 ? 'warning' : 'error'}
                size="lg"
                animate
              />
            </div>

            <div className="bg-primary-50 rounded-xl p-4">
              <h4 className="font-medium text-text-primary mb-2">AI Recommendations</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Review for atypical features</li>
                <li>• Compare with patient history if available</li>
                <li>• Consider dermoscopy if suspicious</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="border-t border-white/10 pt-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4">Your Review</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Decision *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value as Submission['status'])}
                    className={`
                      p-3 rounded-xl border-2 text-left transition-all
                      ${selectedStatus === option.value
                        ? option.color === 'success'
                          ? 'border-success-500 bg-success-50 text-success-800'
                          : 'border-error-500 bg-error-50 text-error-800'
                        : 'border-white/30 text-text-primary hover:border-primary-300'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      {option.color === 'success' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-text-primary mb-2">
                Clinical Notes * 
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Enter your professional assessment and recommendations..."
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-text-primary placeholder-text-secondary focus-ring resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex items-center justify-center px-6 py-3 glass-strong border border-white/20 text-text-primary rounded-xl font-medium hover:bg-white/20 focus-ring"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!notes.trim()}
            className={`
              flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-medium focus-ring
              ${notes.trim()
                ? selectedStatus === 'approved'
                  ? 'bg-success-500 text-white hover:bg-success-600'
                  : 'bg-error-500 text-white hover:bg-error-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {selectedStatus === 'approved' ? (
              <><CheckCircle className="h-4 w-4 mr-2" /> Approve Submission</>
            ) : (
              <><AlertTriangle className="h-4 w-4 mr-2" /> Request Re-upload</>
            )}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}

export default function DoctorSubmissions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showReviewDrawer, setShowReviewDrawer] = useState(false);

  const { submissions, updateSubmissionStatus } = useStore();

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.aiLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesConfidence = confidenceFilter === 'all' ||
      (confidenceFilter === 'high' && submission.confidence >= 80) ||
      (confidenceFilter === 'medium' && submission.confidence >= 60 && submission.confidence < 80) ||
      (confidenceFilter === 'low' && submission.confidence < 60);
    
    return matchesSearch && matchesStatus && matchesConfidence;
  });

  const handleReview = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowReviewDrawer(true);
  };

  const handleSubmitReview = (status: Submission['status'], notes: string) => {
    if (selectedSubmission) {
      updateSubmissionStatus(selectedSubmission.id, status, notes);
    }
  };

  const columns: Column<Submission>[] = [
    {
      key: 'thumbnail',
      label: 'Image',
      render: (submission) => (
        <img
          src={submission.thumbnail}
          alt="Submission"
          className="w-12 h-12 object-cover rounded-lg"
        />
      ),
    },
    {
      key: 'patientId',
      label: 'Patient ID',
      sortable: true,
      render: (submission) => (
        <span className="font-mono text-sm">{submission.patientId}</span>
      ),
    },
    {
      key: 'aiLabel',
      label: 'AI Analysis',
      sortable: true,
    },
    {
      key: 'confidence',
      label: 'Confidence',
      sortable: true,
      render: (submission) => (
        <div className="flex items-center space-x-2">
          <div className="w-12">
            <ProgressBar
              value={submission.confidence}
              size="sm"
              showValue={false}
              color={submission.confidence > 80 ? 'success' : submission.confidence > 60 ? 'warning' : 'error'}
            />
          </div>
          <span className="text-sm font-medium">{submission.confidence}%</span>
        </div>
      ),
    },
    {
      key: 'dateISO',
      label: 'Submitted',
      sortable: true,
      render: (submission) => (
        <span className="text-sm">{new Date(submission.dateISO).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (submission) => (
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${submission.status === 'pending' ? 'bg-warning-100 text-warning-800' :
            submission.status === 'approved' ? 'bg-success-100 text-success-800' :
            'bg-error-100 text-error-800'}
        `}>
          {submission.status}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (submission) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleReview(submission)}
          className="flex items-center px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus-ring text-sm font-medium"
        >
          <Eye className="h-4 w-4 mr-1" />
          Review
        </motion.button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Patient Submissions</h1>
        <p className="text-text-secondary">
          Review AI analysis results and provide medical assessment
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
                    placeholder="Search by patient ID or condition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-primary placeholder-text-secondary focus-ring"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-primary focus-ring"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <select
                  value={confidenceFilter}
                  onChange={(e) => setConfidenceFilter(e.target.value)}
                  className="px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-primary focus-ring"
                >
                  <option value="all">All Confidence</option>
                  <option value="high">High (&gt;80%)</option>
                  <option value="medium">Medium (60-80%)</option>
                  <option value="low">Low (&lt;60%)</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Submissions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                icon={Clock}
                title={searchQuery || statusFilter !== 'all' || confidenceFilter !== 'all' 
                  ? "No matching submissions" 
                  : "No submissions yet"}
                description={
                  searchQuery || statusFilter !== 'all' || confidenceFilter !== 'all'
                    ? "Try adjusting your search or filters"
                    : "Patient submissions will appear here for your review"
                }
              />
            </CardBody>
          </Card>
        ) : (
          <Table
            data={filteredSubmissions}
            columns={columns}
            searchable={false}
            onRowClick={handleReview}
          />
        )}
      </motion.div>

      {/* Review Modal */}
      <ReviewDrawer
        submission={selectedSubmission}
        isOpen={showReviewDrawer}
        onClose={() => {
          setShowReviewDrawer(false);
          setSelectedSubmission(null);
        }}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}