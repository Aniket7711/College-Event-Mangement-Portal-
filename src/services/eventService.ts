import api from './api';
import { Event } from '@/types';

export const eventService = {
  async getEvents(params?: { status?: string; organizerId?: string }) {
    const { data } = await api.get('/events', { params });
    return data as Event[];
  },

  async getEvent(id: string) {
    const { data } = await api.get(`/events/${id}`);
    return data as Event;
  },

  async createEvent(eventData: Partial<Event>) {
    const { data } = await api.post('/events', eventData);
    return data as Event;
  },

  async updateEvent(id: string, eventData: Partial<Event>) {
    const { data } = await api.put(`/events/${id}`, eventData);
    return data as Event;
  },

  async deleteEvent(id: string) {
    await api.delete(`/events/${id}`);
  },

  async approveEvent(id: string) {
    const { data } = await api.patch(`/events/${id}/approve`);
    return data as Event;
  },

  async rejectEvent(id: string, reason: string) {
    const { data } = await api.patch(`/events/${id}/reject`, { reason });
    return data as Event;
  },

  async completeEvent(id: string) {
    const { data } = await api.patch(`/events/${id}/complete`);
    return data as Event;
  },

  async cancelEvent(id: string) {
    const { data } = await api.patch(`/events/${id}/cancel`);
    return data as Event;
  },
};
