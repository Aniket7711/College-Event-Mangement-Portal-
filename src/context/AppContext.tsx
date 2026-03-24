import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Event, Registration, Feedback, Notification, UserRole, EventStatus, RegistrationStatus } from '@/types';
import { MOCK_USERS, MOCK_EVENTS, MOCK_REGISTRATIONS, MOCK_FEEDBACK, MOCK_NOTIFICATIONS } from '@/data/mockData';
import { v4 as uuid } from 'uuid';

interface AppContextType {
  user: User | null;
  users: User[];
  events: Event[];
  registrations: Registration[];
  feedbacks: Feedback[];
  notifications: Notification[];
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (data: Omit<User, 'id' | 'isActive' | 'createdAt' | 'avatar'>) => { success: boolean; message: string };
  logout: () => void;
  createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'registeredCount' | 'status'>) => void;
  updateEvent: (id: string, data: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  approveEvent: (id: string) => void;
  rejectEvent: (id: string, reason: string) => void;
  completeEvent: (id: string) => void;
  cancelEvent: (id: string) => void;
  registerForEvent: (eventId: string) => { success: boolean; message: string };
  cancelRegistration: (regId: string) => void;
  checkIn: (qrToken: string, scannerId: string) => { success: boolean; message: string; registration?: Registration };
  submitFeedback: (eventId: string, rating: number, comment: string) => void;
  markNotificationRead: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

const loadState = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(loadState('campus_user', null));
  const [users, setUsers] = useState<User[]>(loadState('campus_users', MOCK_USERS));
  const [events, setEvents] = useState<Event[]>(loadState('campus_events', MOCK_EVENTS));
  const [registrations, setRegistrations] = useState<Registration[]>(loadState('campus_regs', MOCK_REGISTRATIONS));
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(loadState('campus_feedback', MOCK_FEEDBACK));
  const [notifications, setNotifications] = useState<Notification[]>(loadState('campus_notifs', MOCK_NOTIFICATIONS));

  useEffect(() => { localStorage.setItem('campus_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('campus_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('campus_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('campus_regs', JSON.stringify(registrations)); }, [registrations]);
  useEffect(() => { localStorage.setItem('campus_feedback', JSON.stringify(feedbacks)); }, [feedbacks]);
  useEffect(() => { localStorage.setItem('campus_notifs', JSON.stringify(notifications)); }, [notifications]);

  const addNotification = (userId: string, title: string, message: string, type: Notification['type'] = 'info') => {
    const notif: Notification = { id: uuid(), userId, title, message, type, isRead: false, createdAt: new Date().toISOString() };
    setNotifications(prev => [notif, ...prev]);
  };

  const login = (email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, message: 'Invalid email or password' };
    if (!found.isActive) return { success: false, message: 'Account is deactivated. Contact admin.' };
    setUser(found);
    return { success: true, message: 'Login successful' };
  };

  const signup = (data: Omit<User, 'id' | 'isActive' | 'createdAt' | 'avatar'>) => {
    if (users.find(u => u.email === data.email)) return { success: false, message: 'Email already registered' };
    const newUser: User = { ...data, id: uuid(), isActive: true, createdAt: new Date().toISOString(), avatar: '' };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { success: true, message: 'Account created successfully' };
  };

  const logout = () => setUser(null);

  const createEvent = (data: Omit<Event, 'id' | 'createdAt' | 'registeredCount' | 'status'>) => {
    const evt: Event = { ...data, id: uuid(), registeredCount: 0, status: 'pending', createdAt: new Date().toISOString() };
    setEvents(prev => [...prev, evt]);
    addNotification(data.organizerId, 'Event Created', `Your event "${data.title}" has been submitted for approval.`, 'info');
  };

  const updateEvent = (id: string, data: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const approveEvent = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' as EventStatus } : e));
    const evt = events.find(e => e.id === id);
    if (evt) addNotification(evt.organizerId, 'Event Approved', `Your event "${evt.title}" has been approved!`, 'success');
  };

  const rejectEvent = (id: string, reason: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' as EventStatus, rejectionReason: reason } : e));
    const evt = events.find(e => e.id === id);
    if (evt) addNotification(evt.organizerId, 'Event Rejected', `Your event "${evt.title}" was rejected: ${reason}`, 'error');
  };

  const completeEvent = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'completed' as EventStatus } : e));
  };

  const cancelEvent = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'cancelled' as EventStatus } : e));
  };

  const registerForEvent = (eventId: string) => {
    if (!user) return { success: false, message: 'Please login first' };
    const evt = events.find(e => e.id === eventId);
    if (!evt) return { success: false, message: 'Event not found' };
    if (evt.status !== 'approved') return { success: false, message: 'Event is not available for registration' };
    if (new Date(evt.registrationDeadline) < new Date()) return { success: false, message: 'Registration deadline has passed' };
    if (evt.registeredCount >= evt.totalSeats) return { success: false, message: 'Event is full' };
    if (registrations.find(r => r.studentId === user.id && r.eventId === eventId && r.status !== 'cancelled'))
      return { success: false, message: 'You are already registered' };

    const reg: Registration = {
      id: uuid(), studentId: user.id, studentName: user.name, studentEmail: user.email,
      studentRollNumber: user.rollNumber, eventId, eventTitle: evt.title,
      status: 'registered', qrToken: uuid(), registeredAt: new Date().toISOString()
    };
    setRegistrations(prev => [...prev, reg]);
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e));
    addNotification(user.id, 'Registration Confirmed', `You are registered for "${evt.title}".`, 'success');
    return { success: true, message: 'Registration successful!' };
  };

  const cancelRegistration = (regId: string) => {
    const reg = registrations.find(r => r.id === regId);
    if (reg) {
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'cancelled' as RegistrationStatus } : r));
      setEvents(prev => prev.map(e => e.id === reg.eventId ? { ...e, registeredCount: Math.max(0, e.registeredCount - 1) } : e));
    }
  };

  const checkIn = (qrToken: string, scannerId: string) => {
    const reg = registrations.find(r => r.qrToken === qrToken);
    if (!reg) return { success: false, message: 'Invalid QR code' };
    if (reg.status === 'cancelled') return { success: false, message: 'Registration was cancelled' };
    if (reg.checkedInAt) return { success: false, message: 'Already checked in' };
    const updated = { ...reg, status: 'attended' as RegistrationStatus, checkedInAt: new Date().toISOString() };
    setRegistrations(prev => prev.map(r => r.qrToken === qrToken ? updated : r));
    return { success: true, message: `${reg.studentName} checked in successfully!`, registration: updated };
  };

  const submitFeedback = (eventId: string, rating: number, comment: string) => {
    if (!user) return;
    const evt = events.find(e => e.id === eventId);
    const fb: Feedback = {
      id: uuid(), eventId, eventTitle: evt?.title || '', studentId: user.id,
      studentName: user.name, rating, comment, createdAt: new Date().toISOString()
    };
    setFeedbacks(prev => [...prev, fb]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
  };

  return (
    <AppContext.Provider value={{
      user, users, events, registrations, feedbacks, notifications,
      login, signup, logout, createEvent, updateEvent, deleteEvent,
      approveEvent, rejectEvent, completeEvent, cancelEvent,
      registerForEvent, cancelRegistration, checkIn, submitFeedback,
      markNotificationRead, toggleUserStatus, updateProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};
