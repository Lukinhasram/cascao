import axios from 'axios';
import type { ClimateAnalysisResponse } from '../types/climate';

// Production backend URL - CORRECT ONE
const API_BASE_URL = 'https://cascao-backend-880627998185.us-central1.run.app';

export interface ClimateQueryParams {
  lat: number;
  lon: number;
  day: number;
  month: number;
}

export const climateService = {
  /**
   * Fetch climate analysis data from the backend API
   */
  async getClimateAnalysis(params: ClimateQueryParams): Promise<ClimateAnalysisResponse> {
    console.log('🌍 Fetching climate data for:', params);
    
    try {
      const response = await axios.get<ClimateAnalysisResponse>(
        `${API_BASE_URL}/v1/climate-analysis`,
        { params }
      );
      console.log('✅ Climate data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching climate data:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const detail = error.response.data?.detail || error.message;
          console.error('Server error response:', error.response.data);
          throw new Error(`Server error: ${detail}`);
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response from server. Request:', error.request);
          throw new Error('Could not connect to server. Please check if backend is running.');
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      }
      throw new Error('Unknown error fetching climate data');
    }
  }
};
