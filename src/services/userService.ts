import api from './api';
import { User } from '@/types';

export const userService = {
  async getUsers() {
    const { data } = await api.get('/users');
    return data as User[];
  },

  async toggleUserStatus(id: string) {
    const { data } = await api.patch(`/users/${id}/toggle-status`);
    return data as User;
  },

  async updateProfile(profileData: Partial<User>) {
    const { data } = await api.put('/users/profile', profileData);
    return data as User;
  },
};
