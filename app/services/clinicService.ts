import { api } from '../lib/api';

/**
 * Gravity Clinic API Service
 * 
 * Specialized functions to interact with the Laravel backend.
 * These functions decouple UI components from the underlying API client.
 */

export interface ConnectionTestResponse {
  status: string;
  message: string;
  timestamp: string;
}

const mapLanguage = (lang: string) => {
  switch (lang) {
    case 'ar': return 'Arabic';
    case 'en': return 'English';
    case 'fr': return 'French';
    case 'ru': return 'Russian';
    default: return 'English';
  }};

export const clinicService = {
  /**
   * System Connectivity Check
   */
  checkConnection: () => 
    api.get<ConnectionTestResponse>('/test-connection'),

  /**
   * Public Website Data
   */
  getSettings: () => 
    api.get<any>('/public/settings'),

  getFullInit: () => 
    api.get<any>('/public/init-full'),

  getNavLinks: () => 
    api.get<any[]>('/public/nav-links'),

  getStats: () => 
    api.get<any[]>('/public/stats'),

  getProcessSteps: () => 
    api.get<any[]>('/public/process-steps'),

  getTreatments: () => 
    api.get<any[]>('/public/treatments'),

  getAdminTreatment: (id: number | string) => api.get<any>(`/admin/treatments/${id}`),

  getTestimonials: () => 
    api.get<any[]>('/public/testimonials'),

  getFaqs: () => 
    api.get<any[]>('/public/faqs'),

  getLocations: () => 
    api.get<any[]>('/public/locations'),

  submitLead: (data: any , language: string) => 
    api.post('/public/leads', { ...data, language: mapLanguage(language) }),

  getBlogs: () => 
    api.get<any[]>('/public/blogs'),

  getDoctors: () => 
    api.get<any[]>('/public/doctors'),

  getResults: () => 
    api.get<any[]>('/public/results'),

  /**
   * Authentication
   */
  login: (credentials: { email: string; password: string }) => 
    api.post('/login', credentials),

  verifyOtp: (data: { email: string; code: string }) => 
    api.post('/verify-otp', data),
  
  resendOtp: (data: { email: string }) => 
    api.post('/resend-otp', data),

  logout: () => 
    api.post('/logout', {}),

  forgotPassword: (data: { email: string }) => 
    api.post('/forgot-password', data),

  resetPassword: (data: any) => 
    api.post('/reset-password', data),

  getUser: () => 
    api.get<any>('/me'),

  /**
   * Admin API Methods
   */
  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    // Do NOT set Content-Type manually — the browser must set it with the boundary
    return api.post('/admin/upload', formData);
  },

  updateSettingsBatch: (settings: { key: string; value: any }[]) => 
    api.post('/admin/settings/batch', { settings }),

  syncNavLinks: (links: any[]) => 
    api.post('/admin/nav-links/sync', { links }),

  // Treatments
  createTreatment: (data: any) => api.post('/admin/treatments', data),
  updateTreatment: (id: number, data: any) => api.put(`/admin/treatments/${id}`, data),
  deleteTreatment: (id: number) => api.delete(`/admin/treatments/${id}`),

  // Results
  createResult: (data: any) => api.post('/admin/results', data),
  updateResult: (id: number, data: any) => api.put(`/admin/results/${id}`, data),
  deleteResult: (id: number) => api.delete(`/admin/results/${id}`),

  // Doctors
  createDoctor: (data: any) => api.post('/admin/doctors', data),
  updateDoctor: (id: number, data: any) => api.put(`/admin/doctors/${id}`, data),
  deleteDoctor: (id: number) => api.delete(`/admin/doctors/${id}`),

  // Blogs
  createBlog: (data: any) => api.post('/admin/blogs', data),
  updateBlog: (id: number, data: any) => api.put(`/admin/blogs/${id}`, data),
  deleteBlog: (id: number) => api.delete(`/admin/blogs/${id}`),

  // Stats
  createStat: (data: any) => api.post('/admin/stats', data),
  updateStat: (id: number, data: any) => api.put(`/admin/stats/${id}`, data),
  deleteStat: (id: number) => api.delete(`/admin/stats/${id}`),

  // Process Steps
  createProcessStep: (data: any) => api.post('/admin/process-steps', data),
  updateProcessStep: (id: number, data: any) => api.put(`/admin/process-steps/${id}`, data),
  deleteProcessStep: (id: number) => api.delete(`/admin/process-steps/${id}`),

  // Social Links
  createSocialLink: (data: any) => api.post('/admin/social-links', data),
  updateSocialLink: (id: number, data: any) => api.put(`/admin/social-links/${id}`, data),
  deleteSocialLink: (id: number) => api.delete(`/admin/social-links/${id}`),

  // FAQs
  createFaq: (data: any) => api.post('/admin/faqs', data),
  updateFaq: (id: number, data: any) => api.put(`/admin/faqs/${id}`, data),
  deleteFaq: (id: number) => api.delete(`/admin/faqs/${id}`),

  // Testimonials
  createTestimonial: (data: any) => api.post('/admin/testimonials', data),
  updateTestimonial: (id: number, data: any) => api.put(`/admin/testimonials/${id}`, data),
  deleteTestimonial: (id: number) => api.delete(`/admin/testimonials/${id}`),

  // Locations
  createLocation: (data: any) => api.post('/admin/locations', data),
  updateLocation: (id: number, data: any) => api.put(`/admin/locations/${id}`, data),
  deleteLocation: (id: number) => api.delete(`/admin/locations/${id}`),
};

