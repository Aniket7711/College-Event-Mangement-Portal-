import api from './api';

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async signup(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    rollNumber: string;
    department: string;
    year: string;
  }) {
    const { data } = await api.post('/auth/signup', userData);
    return data;
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async loginWithGoogle(token: string) {
    const { data } = await api.post('/auth/google', { token });
    return data;
  },
};
