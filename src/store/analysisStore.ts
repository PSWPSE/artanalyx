import { create } from 'zustand';
import { AnalysisResult, UploadStatus, AnalysisMode } from '@/types';

interface AnalysisState {
  // 상태
  uploadStatus: UploadStatus;
  currentAnalysis: AnalysisResult | null;
  analysisHistory: AnalysisResult[];
  error: string | null;
  
  // 업로드 관련
  uploadedImage: string | null;
  childAge: number | null;
  analysisMode: AnalysisMode;
  
  // 액션
  setUploadStatus: (status: UploadStatus) => void;
  setUploadedImage: (imageUrl: string | null) => void;
  setChildAge: (age: number | null) => void;
  setAnalysisMode: (mode: AnalysisMode) => void;
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
  analysisMode: 'deep', // 기본값: 심층적 연구 분석

  // 액션
  setUploadStatus: (status) => set({ uploadStatus: status }),
  
  setUploadedImage: (imageUrl) => set({ uploadedImage: imageUrl }),
  
  setChildAge: (age) => set({ childAge: age }),
  
  setAnalysisMode: (mode) => set({ analysisMode: mode }),
  
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
    uploadStatus: 'idle',
    analysisMode: 'deep',
  }),
  
  reset: () => set({
    uploadStatus: 'idle',
    currentAnalysis: null,
    analysisHistory: [],
    error: null,
    uploadedImage: null,
    childAge: null,
    analysisMode: 'deep',
  }),
}));
