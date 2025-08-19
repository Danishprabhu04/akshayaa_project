export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  avatar?: string;
}

export interface Report {
  id: string;
  patientId: string;
  dateISO: string;
  thumbnail: string;
  condition: string;
  confidence: number;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  recommendations?: string[];
  doctorNotes?: string;
}

export interface Submission {
  id: string;
  patientId: string;
  dateISO: string;
  thumbnail: string;
  aiLabel: string;
  confidence: number;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  doctorNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Activity {
  id: string;
  type: 'submission' | 'review' | 'approval' | 'rejection';
  message: string;
  timestamp: string;
  userId?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

// Mock placeholder images (SVG data URLs)
const generatePlaceholder = (color: string, text: string) => 
  `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.4" />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill="url(#grad)" />
      <text x="100" y="80" font-family="Arial" font-size="14" fill="white" text-anchor="middle">${text}</text>
    </svg>
  `)}`;

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@skinvision.com',
    role: 'doctor',
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'patient',
  },
];

export const mockReports: Report[] = [
  {
    id: 'r1',
    patientId: '2',
    dateISO: '2024-01-15T10:30:00Z',
    thumbnail: generatePlaceholder('#3FA3A6', 'Mole Analysis'),
    condition: 'Benign Mole',
    confidence: 87,
    status: 'reviewed',
    recommendations: [
      'Monitor for changes in size, color, or shape',
      'Schedule routine dermatology check-up in 6 months',
      'Apply sunscreen daily to prevent UV damage',
    ],
    doctorNotes: 'Appears to be a normal benign mole. No immediate concerns.',
  },
  {
    id: 'r2',
    patientId: '2',
    dateISO: '2024-01-20T14:15:00Z',
    thumbnail: generatePlaceholder('#6EC6CA', 'Skin Lesion'),
    condition: 'Seborrheic Keratosis',
    confidence: 92,
    status: 'approved',
    recommendations: [
      'This is a common, benign skin growth',
      'No treatment required unless cosmetically bothersome',
      'Continue regular skin self-examinations',
    ],
  },
  {
    id: 'r3',
    patientId: '2',
    dateISO: '2024-01-25T16:45:00Z',
    thumbnail: generatePlaceholder('#f59e0b', 'Suspicious Lesion'),
    condition: 'Requires Further Evaluation',
    confidence: 65,
    status: 'pending',
    recommendations: [
      'Schedule an in-person dermatology consultation',
      'Monitor for rapid changes',
      'Avoid sun exposure to the area',
    ],
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 's1',
    patientId: 'p001',
    dateISO: '2024-01-26T09:30:00Z',
    thumbnail: generatePlaceholder('#22c55e', 'New Upload'),
    aiLabel: 'Melanoma Risk Assessment',
    confidence: 78,
    status: 'pending',
  },
  {
    id: 's2',
    patientId: 'p002',
    dateISO: '2024-01-26T11:15:00Z',
    thumbnail: generatePlaceholder('#ef4444', 'Priority Review'),
    aiLabel: 'Atypical Pigmented Lesion',
    confidence: 89,
    status: 'pending',
  },
  {
    id: 's3',
    patientId: 'p003',
    dateISO: '2024-01-25T15:20:00Z',
    thumbnail: generatePlaceholder('#3FA3A6', 'Reviewed'),
    aiLabel: 'Benign Nevus',
    confidence: 94,
    status: 'approved',
    doctorNotes: 'Typical benign mole characteristics. Patient advised for routine monitoring.',
    reviewedBy: 'Dr. Sarah Chen',
    reviewedAt: '2024-01-25T16:30:00Z',
  },
];

export const mockActivity: Activity[] = [
  {
    id: 'a1',
    type: 'submission',
    message: 'New submission from Patient p001',
    timestamp: '2024-01-26T09:30:00Z',
  },
  {
    id: 'a2',
    type: 'review',
    message: 'Reviewed submission s3 - Approved',
    timestamp: '2024-01-25T16:30:00Z',
    userId: '1',
  },
  {
    id: 'a3',
    type: 'submission',
    message: 'New high-priority submission from Patient p002',
    timestamp: '2024-01-26T11:15:00Z',
  },
];

// Bot responses for chatbot
export const botResponses = [
  "I understand your concern about skin health. It's great that you're being proactive!",
  "For any suspicious changes in moles or skin lesions, I'd recommend consulting with a dermatologist.",
  "Remember to apply broad-spectrum sunscreen daily, even on cloudy days.",
  "Regular self-examinations can help you notice changes early. The ABCDE rule is helpful: Asymmetry, Border, Color, Diameter, Evolving.",
  "If you notice rapid changes in size, color, or texture, it's best to get a professional evaluation.",
  "Our AI analysis is a helpful screening tool, but it doesn't replace professional medical advice.",
  "Skin health is important! Make sure to stay hydrated and maintain a healthy diet rich in antioxidants.",
  "If you have a family history of skin cancer, regular dermatology check-ups are especially important.",
  "I'm here to provide general guidance, but for specific medical concerns, please consult with your healthcare provider.",
  "Early detection is key in skin health. Keep up with your regular skin checks!"
];