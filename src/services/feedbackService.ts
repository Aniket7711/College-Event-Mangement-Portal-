import api from './api';
import { Feedback } from '@/types';

export const feedbackService = {
  async getFeedback() {
    const { data } = await api.get('/feedback');
    return data as Feedback[];
  },

  async submitFeedback(eventId: string, rating: number, comment: string) {
    const { data } = await api.post('/feedback', { eventId, rating, comment });
    return data as Feedback;
  },
};
