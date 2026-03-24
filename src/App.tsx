import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { ProtectedRoute, RoleProtectedRoute } from "@/components/auth/ProtectedRoute";

import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentEvents from "./pages/student/StudentEvents";
import StudentRegistrations from "./pages/student/StudentRegistrations";
import StudentAttendance from "./pages/student/StudentAttendance";

import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import OrganizerEvents from "./pages/organizer/OrganizerEvents";
import CreateEventPage from "./pages/organizer/CreateEventPage";
import EditEventPage from "./pages/organizer/EditEventPage";
import ParticipantsPage from "./pages/organizer/ParticipantsPage";
import QRScannerPage from "./pages/organizer/QRScannerPage";
import OrganizerFeedback from "./pages/organizer/OrganizerFeedback";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminPendingEvents from "./pages/admin/AdminPendingEvents";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import ProfilePage from "./pages/shared/ProfilePage";
import NotificationsPage from "./pages/shared/NotificationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<RoleProtectedRoute roles={['student']}><StudentDashboard /></RoleProtectedRoute>} />
            <Route path="/student/events" element={<RoleProtectedRoute roles={['student']}><StudentEvents /></RoleProtectedRoute>} />
            <Route path="/student/registrations" element={<RoleProtectedRoute roles={['student']}><StudentRegistrations /></RoleProtectedRoute>} />
            <Route path="/student/attendance" element={<RoleProtectedRoute roles={['student']}><StudentAttendance /></RoleProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Organizer Routes */}
            <Route path="/organizer/dashboard" element={<RoleProtectedRoute roles={['organizer']}><OrganizerDashboard /></RoleProtectedRoute>} />
            <Route path="/organizer/events" element={<RoleProtectedRoute roles={['organizer']}><OrganizerEvents /></RoleProtectedRoute>} />
            <Route path="/organizer/events/create" element={<RoleProtectedRoute roles={['organizer']}><CreateEventPage /></RoleProtectedRoute>} />
            <Route path="/organizer/events/:id/edit" element={<RoleProtectedRoute roles={['organizer']}><EditEventPage /></RoleProtectedRoute>} />
            <Route path="/organizer/events/:id/participants" element={<RoleProtectedRoute roles={['organizer']}><ParticipantsPage /></RoleProtectedRoute>} />
            <Route path="/organizer/events/:id/scanner" element={<RoleProtectedRoute roles={['organizer', 'admin']}><QRScannerPage /></RoleProtectedRoute>} />
            <Route path="/organizer/feedback" element={<RoleProtectedRoute roles={['organizer']}><OrganizerFeedback /></RoleProtectedRoute>} />
            <Route path="/organizer/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/organizer/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<RoleProtectedRoute roles={['admin']}><AdminDashboard /></RoleProtectedRoute>} />
            <Route path="/admin/users" element={<RoleProtectedRoute roles={['admin']}><AdminUsers /></RoleProtectedRoute>} />
            <Route path="/admin/events" element={<RoleProtectedRoute roles={['admin']}><AdminEvents /></RoleProtectedRoute>} />
            <Route path="/admin/events/pending" element={<RoleProtectedRoute roles={['admin']}><AdminPendingEvents /></RoleProtectedRoute>} />
            <Route path="/admin/registrations" element={<RoleProtectedRoute roles={['admin']}><AdminRegistrations /></RoleProtectedRoute>} />
            <Route path="/admin/analytics" element={<RoleProtectedRoute roles={['admin']}><AdminAnalytics /></RoleProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
