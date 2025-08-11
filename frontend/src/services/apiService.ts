import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { User, Family, FamilyMember, AuthResponse, RegisterData } from '../types'
import { BACKEND_CONFIG } from '../config/backend-config'

const API_BASE_URL = BACKEND_CONFIG.API_BASE_URL

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.clearAuthToken()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  clearAuthToken() {
    delete this.api.defaults.headers.common['Authorization']
  }

  // Authentication endpoints
  auth = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', {
        email,
        password,
      })
      return response.data
    },

    register: async (userData: RegisterData): Promise<AuthResponse> => {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData)
      return response.data
    },

    verify: async (): Promise<{ message: string; user: User }> => {
      const response = await this.api.get('/auth/verify')
      return response.data
    },
  }

  // Family management endpoints (placeholder - will be implemented in PROMPT 3)
  families = {
    getAll: async (params?: any): Promise<{ families: Family[]; total: number }> => {
      const response = await this.api.get('/families', { params })
      return response.data
    },

    getById: async (id: string): Promise<Family> => {
      const response = await this.api.get(`/families/${id}`)
      return response.data
    },

    create: async (familyData: any): Promise<Family> => {
      const response = await this.api.post('/families', familyData)
      return response.data
    },

    update: async (id: string, familyData: any): Promise<Family> => {
      const response = await this.api.put(`/families/${id}`, familyData)
      return response.data
    },

    delete: async (id: string): Promise<void> => {
      await this.api.delete(`/families/${id}`)
    },

    getStatistics: async (): Promise<any> => {
      const response = await this.api.get('/families/statistics')
      return response.data
    },
  }

  // Family member management endpoints
  familyMembers = {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      familyId?: string;
      search?: string;
      isActive?: string;
      relationshipToHead?: string;
      gender?: string;
    }): Promise<{
      members: FamilyMember[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }> => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const response = await this.api.get(`/family-members?${queryParams.toString()}`);
      return response.data;
    },

    getById: async (id: string): Promise<FamilyMember> => {
      const response = await this.api.get(`/family-members/${id}`);
      return response.data.member;
    },

    create: async (memberData: any): Promise<FamilyMember> => {
      const response = await this.api.post('/family-members', memberData);
      return response.data.member;
    },

    update: async (id: string, memberData: any): Promise<FamilyMember> => {
      const response = await this.api.put(`/family-members/${id}`, memberData);
      return response.data.member;
    },

    delete: async (id: string): Promise<void> => {
      await this.api.delete(`/family-members/${id}`);
    },

    getBirthdaysThisMonth: async (): Promise<{
      birthdays: FamilyMember[];
      month: number;
      total: number;
    }> => {
      const response = await this.api.get('/family-members/special/birthdays-this-month');
      return response.data;
    },

    getYahrzeitsThisMonth: async (): Promise<{
      yahrzeits: FamilyMember[];
      month: number;
      total: number;
    }> => {
      const response = await this.api.get('/family-members/special/yahrzeits-this-month');
      return response.data;
    },

    getUpcomingBnaiMitzvah: async (): Promise<{
      upcomingBnaiMitzvah: FamilyMember[];
      total: number;
    }> => {
      const response = await this.api.get('/family-members/special/upcoming-bnai-mitzvah');
      return response.data;
    },
  }

  // User management endpoints
  users = {
    getProfile: async (): Promise<User> => {
      const response = await this.api.get('/users/profile')
      return response.data
    },

    updateProfile: async (userData: Partial<User>): Promise<User> => {
      const response = await this.api.put('/users/profile', userData)
      return response.data.user
    },

    getAll: async (): Promise<{ users: User[] }> => {
      const response = await this.api.get('/users')
      return response.data
    },
  }

  // Health check
  health = {
    check: async (): Promise<{ status: string; service: string; timestamp: string }> => {
      const response = await this.api.get('/health')
      return response.data
    },
  }
}

export const apiService = new ApiService() 