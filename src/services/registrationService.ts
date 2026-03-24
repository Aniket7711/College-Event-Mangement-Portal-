import api from './api';
import { CertificateVerification, Registration } from '@/types';

export const registrationService = {
  async getRegistrations() {
    const { data } = await api.get('/registrations');
    return data as Registration[];
  },

  async getEventParticipants(eventId: string) {
    const { data } = await api.get(`/registrations/event/${eventId}`);
    return data as Registration[];
  },

  async register(eventId: string) {
    const { data } = await api.post('/registrations', { eventId });
    return data as Registration;
  },

  async cancelRegistration(id: string) {
    const { data } = await api.patch(`/registrations/${id}/cancel`);
    return data as Registration;
  },

  async checkIn(qrToken: string) {
    const { data } = await api.post('/registrations/checkin', { qrToken });
    return data as { success: boolean; message: string; registration?: Registration };
  },

  async verifyCertificate(code: string) {
    const { data } = await api.get(`/registrations/verify/${code}`);
    return data as CertificateVerification;
  },
};
