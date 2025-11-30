/**
 * Configuration du Router principal
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginContainer } from './containers/LoginContainer';
import { RegisterContainer } from './containers/RegisterContainer';
import { DashboardContainer } from './containers/DashboardContainer';
import { CreateSessionContainer } from './containers/CreateSessionContainer';
import { SessionDetailContainer } from './containers/SessionDetailContainer';
import { InvitationContainer } from './containers/InvitationContainer';
import { ProtectedRoute } from './components/ProtectedRoute';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/register" element={<RegisterContainer />} />
        <Route path="/invite/:code" element={<InvitationContainer />} />

        {/* Routes protégées */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions/create"
          element={
            <ProtectedRoute>
              <CreateSessionContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions/:id"
          element={
            <ProtectedRoute>
              <SessionDetailContainer />
            </ProtectedRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
