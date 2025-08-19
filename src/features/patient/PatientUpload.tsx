import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Upload as UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../../components/Card';
import Dropzone from '../../components/Dropzone';
import ProgressBar from '../../components/ProgressBar';
import { useStore } from '../../state/store';

interface UploadStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function PatientUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { addReport, addToast } = useStore();
  const navigate = useNavigate();

  const steps: UploadStep[] = [
    {
      id: 1,
      title: 'Upload Image',
      description: 'Select a clear photo of the skin area',
      completed: uploadedFiles.length > 0,
    },
    {
      id: 2,
      title: 'Review & Consent',
      description: 'Review upload and provide consent',
      completed: consentGiven,
    },
    {
      id: 3,
      title: 'AI Analysis',
      description: 'Processing with advanced algorithms',
      completed: false,
    },
  ];

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
    setCurrentStep(2);
  };

  const simulateAnalysis = async () => {
    setIsSubmitting(true);
    setCurrentStep(3);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Wait for progress to complete
    await new Promise(resolve => {
      const checkProgress = () => {
        if (uploadProgress >= 100) {
          resolve(true);
        } else {
          setTimeout(checkProgress, 100);
        }
      };
      checkProgress();
    });

    // Generate mock analysis result
    const conditions = [
      'Benign Mole', 
      'Seborrheic Keratosis', 
      'Solar Lentigo', 
      'Atypical Nevus',
      'Requires Further Evaluation'
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomConfidence = Math.floor(Math.random() * 20) + 75; // 75-95%

    // Create thumbnail from uploaded file
    const file = uploadedFiles[0];
    const thumbnail = URL.createObjectURL(file);

    const newReport = {
      patientId: 'current-user',
      thumbnail,
      condition: randomCondition,
      confidence: randomConfidence,
      status: 'pending' as const,
      recommendations: [
        'Monitor for changes in size, color, or shape',
        randomConfidence > 85 
          ? 'Continue routine skin checks'
          : 'Consider professional dermatology consultation',
        'Apply sunscreen daily to prevent UV damage',
      ],
    };

    addReport(newReport);
    
    addToast({
      type: 'success',
      message: 'Analysis complete! Check your reports.',
      duration: 4000,
    });

    setIsSubmitting(false);
    navigate('/patient/reports');
  };

  const handleSubmit = () => {
    if (!uploadedFiles.length || !consentGiven) return;
    simulateAnalysis();
  };

  const canProceed = uploadedFiles.length > 0 && consentGiven;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Upload Skin Image</h1>
        <p className="text-text-secondary">
          Upload a clear, well-lit photo for AI-powered skin analysis
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center space-x-3
                    ${index < steps.length - 1 ? 'flex-1' : ''}
                  `}>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                      ${step.completed 
                        ? 'bg-success-500 text-white' 
                        : currentStep === step.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <h3 className="text-sm font-medium text-text-primary">{step.title}</h3>
                      <p className="text-xs text-text-secondary">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-4
                      ${steps[index + 1].completed || currentStep > step.id
                        ? 'bg-success-500'
                        : 'bg-gray-200'
                      }
                    `} />
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-text-primary">Step 1: Upload Image</h2>
            </CardHeader>
            <CardBody>
              <Dropzone
                onFilesUploaded={handleFilesUploaded}
                accept="image/*"
                maxSize={10}
              />
              
              <div className="mt-6 space-y-3">
                <h3 className="font-medium text-text-primary">Photo Guidelines:</h3>
                <ul className="text-sm text-text-secondary space-y-1 ml-4">
                  <li>• Use natural lighting or bright indoor light</li>
                  <li>• Keep the camera steady and close enough to see detail</li>
                  <li>• Avoid shadows, reflections, or glare</li>
                  <li>• Include a ruler or coin for size reference if possible</li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Consent Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-text-primary">Step 2: Consent & Privacy</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="bg-primary-50 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <h4 className="font-medium text-text-primary mb-2">Important Notice</h4>
                      <p className="text-text-secondary">
                        This AI analysis is for informational purposes only and does not replace 
                        professional medical advice. Always consult a healthcare provider for 
                        medical concerns.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-text-secondary">
                      I understand that this AI analysis is not a medical diagnosis and 
                      I should consult a healthcare professional for any medical concerns. 
                      I consent to the processing of my image for analysis purposes.
                    </span>
                  </label>
                </div>

                {isSubmitting && (
                  <div className="mt-6">
                    <ProgressBar
                      value={uploadProgress}
                      label="Analyzing image..."
                      color="primary"
                      animate
                    />
                  </div>
                )}

                <motion.button
                  whileHover={canProceed ? { scale: 1.02 } : undefined}
                  whileTap={canProceed ? { scale: 0.98 } : undefined}
                  onClick={handleSubmit}
                  disabled={!canProceed || isSubmitting}
                  className={`
                    w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold focus-ring transition-all
                    ${canProceed && !isSubmitting
                      ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="h-5 w-5 mr-2" />
                      Submit for Analysis
                    </>
                  )}
                </motion.button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}