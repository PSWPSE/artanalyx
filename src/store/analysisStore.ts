import { create } from 'zustand';
import { AnalysisResult, UploadStatus } from '@/types';

interface AnalysisState {
  // 상태
  uploadStatus: UploadStatus;
  currentAnalysis: AnalysisResult | null;
  analysisHistory: AnalysisResult[];
  error: string | null;
  
  // 업로드 관련
  uploadedImage: string | null;
  childAge: number | null;
  
  // 액션
  setUploadStatus: (status: UploadStatus) => void;
  setUploadedImage: (imageUrl: string | null) => void;
  setChildAge: (age: number | null) => void;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  addToHistory: (analysis: AnalysisResult) => void;
  setError: (error: string | null) => void;
  clearAnalysis: () => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  // 초기 상태
  uploadStatus: 'idle',
  currentAnalysis: null,
  analysisHistory: [],
  error: null,
  uploadedImage: null,
  childAge: null,

  // 액션
  setUploadStatus: (status) => set({ uploadStatus: status }),
  
  setUploadedImage: (imageUrl) => set({ uploadedImage: imageUrl }),
  
  setChildAge: (age) => set({ childAge: age }),
  
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  
  addToHistory: (analysis) => {
    const currentHistory = get().analysisHistory;
    set({ 
      analysisHistory: [analysis, ...currentHistory].slice(0, 10) // 최근 10개만 유지
    });
  },
  
  setError: (error) => set({ error }),
  
  clearAnalysis: () => set({ 
    currentAnalysis: null, 
    error: null,
    uploadedImage: null,
    childAge: null,
    uploadStatus: 'idle'
  }),
  
  reset: () => set({
    uploadStatus: 'idle',
    currentAnalysis: null,
    analysisHistory: [],
    error: null,
    uploadedImage: null,
    childAge: null,
  }),
}));
