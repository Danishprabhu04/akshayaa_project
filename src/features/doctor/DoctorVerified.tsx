import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Search, Download, Calendar, User, FileText } from 'lucide-react';
import { useState } from 'react';
import { Card, CardBody } from '../../components/Card';
import Table, { type Column } from '../../components/Table';
import EmptyState from '../../components/EmptyState';
import { useStore } from '../../state/store';
import type { Submission } from '../../data/mock';

export default function DoctorVerified() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { submissions, addToast } = useStore();

  // Only show reviewed submissions
  const verifiedSubmissions = submissions.filter(s => s.status !== 'pending');

  const filteredSubmissions = verifiedSubmissions.filter(submission => {
    const matchesSearch = submission.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.aiLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.doctorNotes?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    addToast({
      type: 'info',
      message: 'Export functionality available in full version',
      duration: 3000,
    });
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
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-text-secondary" />
          <span className="font-mono text-sm">{submission.patientId}</span>
        </div>
      ),
    },
    {
      key: 'aiLabel',
      label: 'Condition',
      sortable: true,
      render: (submission) => (
        <div>
          <p className="font-medium text-text-primary">{submission.aiLabel}</p>
          <p className="text-xs text-text-secondary">AI: {submission.confidence}% confidence</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Final Status',
      sortable: true,
      render: (submission) => (
        <div className="flex items-center space-x-2">
          {submission.status === 'approved' ? (
            <>
              <CheckCircle className="h-4 w-4 text-success-500" />
              <span className="px-2 py-1 bg-success-100 text-success-800 rounded-full text-xs font-medium">
                Approved
              </span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-error-500" />
              <span className="px-2 py-1 bg-error-100 text-error-800 rounded-full text-xs font-medium">
                Rejected
              </span>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'reviewedAt',
      label: 'Reviewed',
      sortable: true,
      render: (submission) => (
        <div>
          <p className="text-sm font-medium">{submission.reviewedBy}</p>
          <p className="text-xs text-text-secondary">
            {submission.reviewedAt ? new Date(submission.reviewedAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      ),
    },
    {
      key: 'doctorNotes',
      label: 'Notes',
      render: (submission) => (
        <div className="max-w-xs">
          <p className="text-sm text-text-primary line-clamp-2">
            {submission.doctorNotes || 'No notes provided'}
          </p>
        </div>
      ),
    },
  ];

  const stats = {
    total: verifiedSubmissions.length,
    approved: verifiedSubmissions.filter(s => s.status === 'approved').length,
    rejected: verifiedSubmissions.filter(s => s.status === 'rejected').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Verified Reports</h1>
            <p className="text-text-secondary">
              Review completed cases and export reports
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className="flex items-center px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 focus-ring"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Reports
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardBody className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-1">{stats.total}</h3>
            <p className="text-text-secondary text-sm">Total Reviewed</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-1">{stats.approved}</h3>
            <p className="text-text-secondary text-sm">Approved Cases</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="w-12 h-12 bg-error-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <XCircle className="h-6 w-6 text-error-600" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-1">{stats.rejected}</h3>
            <p className="text-text-secondary text-sm">Rejected Cases</p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card>
          <CardBody>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search by patient ID, condition, or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-primary placeholder-text-secondary focus-ring"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-primary focus-ring lg:w-48"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                icon={FileText}
                title={searchQuery || statusFilter !== 'all' 
                  ? "No matching reports" 
                  : "No verified reports yet"}
                description={
                  searchQuery || statusFilter !== 'all'
                    ? "Try adjusting your search or filters"
                    : "Completed case reviews will appear here"
                }
              />
            </CardBody>
          </Card>
        ) : (
          <Table
            data={filteredSubmissions}
            columns={columns}
            searchable={false}
          />
        )}
      </motion.div>
    </div>
  );
}