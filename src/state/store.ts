import { create } from 'zustand';
import { mockReports, mockSubmissions, mockActivity, type User, type Report, type Submission, type Activity, type ChatMessage, botResponses } from '../data/mock';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface AppState {
  // Auth
  user: User | null;
  
  // Data
  reports: Report[];
  submissions: Submission[];
  activity: Activity[];
  chatMessages: ChatMessage[];
  
  // UI State
  toasts: Toast[];
  sidebarCollapsed: boolean;
  
  // Actions
  login: (role: 'patient' | 'doctor', name: string, email: string) => void;
  logout: () => void;
  
  // Reports
  addReport: (report: Omit<Report, 'id' | 'dateISO'>) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  
  // Submissions
  updateSubmissionStatus: (id: string, status: Report['status'], doctorNotes?: string) => void;
  
  // Activity
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  
  // Chat
  addChatMessage: (content: string, sender: 'user' | 'bot') => void;
  simulateBotResponse: () => void;
  
  // UI
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  reports: mockReports,
  submissions: mockSubmissions,
  activity: mockActivity,
  chatMessages: [],
  toasts: [],
  sidebarCollapsed: false,
  
  // Auth actions
  login: (role, name, email) => {
    const user: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role,
    };
    set({ user });
    
    get().addToast({
      type: 'success',
      message: `Welcome, ${name}!`,
      duration: 3000,
    });
  },
  
  logout: () => {
    set({ user: null, chatMessages: [] });
    get().addToast({
      type: 'info',
      message: 'Logged out successfully',
      duration: 2000,
    });
  },
  
  // Report actions
  addReport: (reportData) => {
    const report: Report = {
      ...reportData,
      id: `r${Date.now()}`,
      dateISO: new Date().toISOString(),
    };
    
    set((state) => ({
      reports: [report, ...state.reports],
    }));
    
    get().addActivity({
      type: 'submission',
      message: `New analysis completed for ${report.condition}`,
    });
  },
  
  updateReport: (id, updates) => {
    set((state) => ({
      reports: state.reports.map((report) =>
        report.id === id ? { ...report, ...updates } : report
      ),
    }));
  },
  
  // Submission actions
  updateSubmissionStatus: (id, status, doctorNotes) => {
    const currentUser = get().user;
    const timestamp = new Date().toISOString();
    
    set((state) => ({
      submissions: state.submissions.map((submission) =>
        submission.id === id
          ? {
              ...submission,
              status,
              doctorNotes,
              reviewedBy: currentUser?.name,
              reviewedAt: timestamp,
            }
          : submission
      ),
    }));
    
    const submission = get().submissions.find(s => s.id === id);
    if (submission) {
      get().addActivity({
        type: 'review',
        message: `Reviewed submission ${id} - ${status}`,
        userId: currentUser?.id,
      });
      
      get().addToast({
        type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info',
        message: `Submission ${status} successfully`,
        duration: 3000,
      });
    }
  },
  
  // Activity actions
  addActivity: (activityData) => {
    const activity: Activity = {
      ...activityData,
      id: `a${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({
      activity: [activity, ...state.activity.slice(0, 49)], // Keep last 50
    }));
  },
  
  // Chat actions
  addChatMessage: (content, sender) => {
    const message: ChatMessage = {
      id: `m${Date.now()}`,
      content,
      sender,
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    }));
    
    // If user message, trigger bot response
    if (sender === 'user') {
      setTimeout(() => {
        get().simulateBotResponse();
      }, 1000 + Math.random() * 2000); // Random delay 1-3s
    }
  },
  
  simulateBotResponse: () => {
    const responses = botResponses;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    get().addChatMessage(randomResponse, 'bot');
  },
  
  // Toast actions
  addToast: (toastData) => {
    const toast: Toast = {
      ...toastData,
      id: `t${Date.now()}`,
      duration: toastData.duration || 5000,
    };
    
    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
    
    // Auto-remove toast
    setTimeout(() => {
      get().removeToast(toast.id);
    }, toast.duration);
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  
  // Sidebar actions
  toggleSidebar: () => {
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    }));
  },
  
  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },
}));