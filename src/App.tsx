import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NexusProvider } from './context/NexusContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ProjectsPage } from './features/projects/ProjectsPage';
import { TasksPage } from './features/tasks/TasksPage';
import { TeamPage } from './features/team/TeamPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { CalendarPage } from './features/calendar/CalendarPage';
import { IntelligencePage } from './features/intelligence/IntelligencePage';
import { ReportsPage } from './features/reports/ReportsPage';
import { NotificationsPage } from './features/notifications/NotificationsPage';
import { SettingsPage } from './features/settings/SettingsPage';

export default function App() {
  return (
    <NexusProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="intelligence" element={<IntelligencePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NexusProvider>
  );
}
