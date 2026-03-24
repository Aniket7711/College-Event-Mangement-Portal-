import api from './api';
import { Notification } from '@/types';

export const notificationService = {
  async getNotifications() {
    const { data } = await api.get('/notifications');
    return data as Notification[];
  },

  async markAsRead(id: string) {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data as Notification;
  },
};
