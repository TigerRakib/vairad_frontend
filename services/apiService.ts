import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Add token to request headers
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async signup(
    username: string,
    email: string,
    password: string
  ) {
    const response = await this.api.post('/auth/signup/', {
      username,
      email,
      password,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login/', {
      email,
      password,
    });
    return response.data;
  }

  async logout() {
    await this.api.post('/auth/logout/');
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/user/');
    return response.data;
  }

  // Task endpoints
  async getTasks(params?: {
    due_date?: string;
    from_date?: string;
    to_date?: string;
  }) {
    const response = await this.api.get('/tasks/', { params });
    return response.data;
  }

  async getTaskById(id: number) {
    const response = await this.api.get(`/tasks/${id}/`);
    return response.data;
  }

  async createTask(data: any) {
    const response = await this.api.post('/tasks/', data);
    return response.data;
  }

  async updateTask(id: number, data: any) {
    const response = await this.api.patch(`/tasks/${id}/`, data);
    return response.data;
  }

  async deleteTask(id: number) {
    await this.api.delete(`/tasks/${id}/`);
  }

  // Annotation Image endpoints
  async getAnnotationImages(params?: { page?: number }) {
    const response = await this.api.get('/annotation-images/', { params });
    return response.data;
  }

  async getAnnotationImageById(id: number) {
    const response = await this.api.get(`/annotation-images/${id}/`);
    return response.data;
  }

  async uploadAnnotationImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await this.api.post('/annotation-images/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async deleteAnnotationImage(id: number) {
    await this.api.delete(`/annotation-images/${id}/`);
  }

  // Polygon Annotation endpoints
  async getPolygonAnnotations(params?: { image?: number }) {
    const response = await this.api.get('/polygon-annotations/', { params });
    return response.data;
  }

  async getPolygonAnnotationById(id: number) {
    const response = await this.api.get(`/polygon-annotations/${id}/`);
    return response.data;
  }

  async createPolygonAnnotation(data: any) {
    const response = await this.api.post('/polygon-annotations/', data);
    return response.data;
  }

  async updatePolygonAnnotation(id: number, data: any) {
    const response = await this.api.patch(`/polygon-annotations/${id}/`, data);
    return response.data;
  }

  async deletePolygonAnnotation(id: number) {
    await this.api.delete(`/polygon-annotations/${id}/`);
  }
}

export const apiService = new ApiService();
