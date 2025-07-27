import { Scam } from '../data/mockScams';

const API_BASE_URL = 'http://localhost:5000/api';

export interface ScamStats {
  totalScams: number;
  highRiskScams: number;
  totalViews: number;
  totalReports: number;
}

export interface ScamFilters {
  search?: string;
  tags?: string[];
  severityMin?: number;
  severityMax?: number;
  sortBy?: 'date' | 'severity' | 'views' | 'reports';
  limit?: number;
  page?: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`🌐 Making API request to: ${url}`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ API Response:`, data);
      return data;
    } catch (error) {
      console.error(`🚨 Network Error:`, error);
      throw error;
    }
  }

  // Get all scams with optional filters
  async getScams(filters?: ScamFilters): Promise<{ scams: Scam[]; total: number }> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('q', filters.search);
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters?.severityMin) params.append('severityMin', filters.severityMin.toString());
    if (filters?.severityMax) params.append('severityMax', filters.severityMax.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const endpoint = `/scams${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<{ success: boolean; data: Scam[]; pagination: any }>(endpoint);
    return {
      scams: response.data,
      total: response.pagination?.total || response.data.length
    };
  }

  // Get a specific scam by ID
  async getScamById(id: string): Promise<Scam> {
    return this.request<Scam>(`/scams/${id}`);
  }

  // Get trending scams
  async getTrendingScams(limit: number = 5): Promise<Scam[]> {
    const response = await this.request<{ success: boolean; data: Scam[] }>(`/scams/trending?limit=${limit}`);
    return response.data;
  }

  // Get scam statistics
  async getScamStats(): Promise<ScamStats> {
    const response = await this.request<{ success: boolean; data: ScamStats }>('/scams/stats');
    return response.data;
  }

  // Get all available tags
  async getTags(): Promise<string[]> {
    const response = await this.request<{ success: boolean; data: string[] }>('/scams/tags');
    return response.data;
  }

  // Report a new scam
  async reportScam(scamData: Partial<Scam>): Promise<Scam> {
    return this.request<Scam>('/scams', {
      method: 'POST',
      body: JSON.stringify(scamData),
    });
  }

  // Report a similar scam
  async reportSimilarScam(scamId: string, reportData: any): Promise<void> {
    return this.request<void>(`/scams/${scamId}/report`, {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  // Increment view count for a scam
  async incrementViewCount(scamId: string): Promise<void> {
    return this.request<void>(`/scams/${scamId}/view`, {
      method: 'POST',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/health');
  }

  // Search scams with real-time functionality
  async searchScams(query: string, limit: number = 20): Promise<Scam[]> {
    try {
      console.log('🔍 Searching for:', query);
      const response = await this.request<{ data: Scam[] }>(`/scams/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('❌ Search error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 