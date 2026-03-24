import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Event, Registration, Feedback, Notification, UserRole } from '@/types';
import { authService } from '@/services/authService';
import { eventService } from '@/services/eventService';
import { registrationService } from '@/services/registrationService';
import { feedbackService } from '@/services/feedbackService';
import { notificationService } from '@/services/notificationService';
import { userService } from '@/services/userService';

interface AppContextType {
  user: User | null;
  users: User[];
  events: Event[];
  registrations: Registration[];
  feedbacks: Feedback[];
  notifications: Notification[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; role?: string }>;
  loginWithGoogle: (token: string) => Promise<{ success: boolean; message: string; role?: string }>;
  signup: (data: { name: string; email: string; password: string; role: UserRole; rollNumber: string; department: string; year: string }) => Promise<{ success: boolean; message: string; role?: string }>;
  logout: () => void;
  createEvent: (event: Partial<Event>) => Promise<void>;
  updateEvent: (id: string, data: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  approveEvent: (id: string) => Promise<void>;
  rejectEvent: (id: string, reason: string) => Promise<void>;
  completeEvent: (id: string) => Promise<void>;
  cancelEvent: (id: string) => Promise<void>;
  registerForEvent: (eventId: string) => Promise<{ success: boolean; message: string }>;
  cancelRegistration: (regId: string) => Promise<void>;
  checkIn: (qrToken: string) => Promise<{ success: boolean; message: string; registration?: Registration }>;
  submitFeedback: (eventId: string, rating: number, comment: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshEvents: () => Promise<void>;
  refreshRegistrations: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshFeedback: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('campus_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('campus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campus_user');
    }
  }, [user]);

  // Refresh functions
  const refreshEvents = useCallback(async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) { console.error('Failed to load events', err); }
  }, []);

  const refreshRegistrations = useCallback(async () => {
    if (!user) { setRegistrations([]); return; }
    try {
      const data = await registrationService.getRegistrations();
      setRegistrations(data);
    } catch (err) { console.error('Failed to load registrations', err); }
  }, [user]);

  const refreshNotifications = useCallback(async () => {
    if (!user) { setNotifications([]); return; }
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) { console.error('Failed to load notifications', err); }
  }, [user]);

  const refreshUsers = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) { console.error('Failed to load users', err); }
  }, [user]);

  const refreshFeedback = useCallback(async () => {
    if (!user) return;
    try {
      const data = await feedbackService.getFeedback();
      setFeedbacks(data);
    } catch (err) { console.error('Failed to load feedback', err); }
  }, [user]);

  // Load data on mount / login
  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  useEffect(() => {
    if (user) {
      refreshRegistrations();
      refreshNotifications();
      refreshFeedback();
      if (user.role === 'admin') refreshUsers();
    }
  }, [user, refreshRegistrations, refreshNotifications, refreshFeedback, refreshUsers]);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('campus_token');
    if (token && user) {
      authService.getMe()
        .then(data => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('campus_token');
          localStorage.removeItem('campus_user');
          setUser(null);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; role?: string }> => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('campus_token', data.token);
      setUser(data.user);
      return { success: true, message: 'Login successful', role: data.user.role };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const loginWithGoogle = async (token: string): Promise<{ success: boolean; message: string; role?: string }> => {
    try {
      const data = await authService.loginWithGoogle(token);
      localStorage.setItem('campus_token', data.token);
      setUser(data.user);
      return { success: true, message: 'Google login successful', role: data.user.role };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Google login failed' };
    }
  };

  const signup = async (userData: { name: string; email: string; password: string; role: UserRole; rollNumber: string; department: string; year: string }): Promise<{ success: boolean; message: string; role?: string }> => {
    try {
      const data = await authService.signup(userData);
      localStorage.setItem('campus_token', data.token);
      setUser(data.user);
      return { success: true, message: 'Account created successfully', role: data.user.role };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('campus_token');
    localStorage.removeItem('campus_user');
    setUser(null);
    setRegistrations([]);
    setNotifications([]);
    setFeedbacks([]);
    setUsers([]);
  };

  const createEvent = async (eventData: Partial<Event>) => {
    const newEvent = await eventService.createEvent(eventData);
    setEvents(prev => [newEvent, ...prev]);
    refreshNotifications();
  };

  const updateEvent = async (id: string, data: Partial<Event>) => {
    const updated = await eventService.updateEvent(id, data);
    setEvents(prev => prev.map(e => e.id === id ? updated : e));
  };

  const deleteEvent = async (id: string) => {
    await eventService.deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const approveEvent = async (id: string) => {
    const updated = await eventService.approveEvent(id);
    setEvents(prev => prev.map(e => e.id === id ? updated : e));
  };

  const rejectEvent = async (id: string, reason: string) => {
    const updated = await eventService.rejectEvent(id, reason);
    setEvents(prev => prev.map(e => e.id === id ? updated : e));
  };

  const completeEvent = async (id: string) => {
    const updated = await eventService.completeEvent(id);
    setEvents(prev => prev.map(e => e.id === id ? updated : e));
  };

  const cancelEvent = async (id: string) => {
    const updated = await eventService.cancelEvent(id);
    setEvents(prev => prev.map(e => e.id === id ? updated : e));
  };

  const registerForEvent = async (eventId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const reg = await registrationService.register(eventId);
      setRegistrations(prev => [reg, ...prev]);
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e));
      refreshNotifications();
      return { success: true, message: 'Registration successful!' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const cancelRegistration = async (regId: string) => {
    const updated = await registrationService.cancelRegistration(regId);
    setRegistrations(prev => prev.map(r => r.id === regId ? updated : r));
    refreshEvents();
  };

  const checkIn = async (qrToken: string): Promise<{ success: boolean; message: string; registration?: Registration }> => {
    try {
      const result = await registrationService.checkIn(qrToken);
      if (result.registration) {
        setRegistrations(prev => prev.map(r => r.qrToken === qrToken ? result.registration! : r));
      }
      return result;
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Check-in failed' };
    }
  };

  const submitFeedback = async (eventId: string, rating: number, comment: string) => {
    const fb = await feedbackService.submitFeedback(eventId, rating, comment);
    setFeedbacks(prev => [fb, ...prev]);
  };

  const markNotificationRead = async (id: string) => {
    const updated = await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? updated : n));
  };

  const toggleUserStatus = async (id: string) => {
    const updated = await userService.toggleUserStatus(id);
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
  };

  const updateProfile = async (data: Partial<User>) => {
    const updated = await userService.updateProfile(data);
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  return (
    <AppContext.Provider value={{
      user, users, events, registrations, feedbacks, notifications, loading,
      login, loginWithGoogle, signup, logout, createEvent, updateEvent, deleteEvent,
      approveEvent, rejectEvent, completeEvent, cancelEvent,
      registerForEvent, cancelRegistration, checkIn, submitFeedback,
      markNotificationRead, toggleUserStatus, updateProfile,
      refreshEvents, refreshRegistrations, refreshNotifications, refreshUsers, refreshFeedback,
    }}>
      {children}
    </AppContext.Provider>
  );
};
