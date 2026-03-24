export type UserRole = 'student' | 'organizer' | 'admin';
export type EventStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
export type RegistrationStatus = 'registered' | 'cancelled' | 'attended';
export type EventMode = 'offline' | 'online' | 'hybrid';
export type EventCategory = 'Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Seminar' | 'Hackathon' | 'Fest' | 'Career' | 'Club Activity' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  rollNumber: string;
  department: string;
  year: string;
  avatar: string;
  isActive: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: EventCategory;
  department: string;
  organizerId: string;
  organizerName: string;
  venue: string;
  mode: EventMode;
  date: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  totalSeats: number;
  registeredCount: number;
  posterUrl: string;
  rules: string;
  contactEmail: string;
  contactPhone: string;
  tags: string[];
  status: EventStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRollNumber: string;
  eventId: string;
  eventTitle: string;
  status: RegistrationStatus;
  qrToken: string;
  checkedInAt?: string;
  registeredAt: string;
}

export interface Feedback {
  id: string;
  eventId: string;
  eventTitle: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface ScanLog {
  id: string;
  eventId: string;
  registrationId: string;
  scannedBy: string;
  scanStatus: 'success' | 'duplicate' | 'invalid';
  scannedAt: string;
}

export const EVENT_CATEGORIES: EventCategory[] = [
  'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar',
  'Hackathon', 'Fest', 'Career', 'Club Activity', 'Other'
];

export const DEPARTMENTS = [
  'Computer Science', 'Electronics', 'Mechanical', 'Civil',
  'Electrical', 'Information Technology', 'Chemical', 'Biotechnology', 'Other'
];
