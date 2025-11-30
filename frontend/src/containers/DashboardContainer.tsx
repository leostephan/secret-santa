/**
 * Container Dashboard
 * Gère la logique métier et passe uniquement des scalaires au composant pur
 */

import { useNavigate } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { PageLayout } from '../components';
import { useUserSessions } from '../hooks/useSessions';
import { useAuth } from '../contexts/AuthContext';
import { useLogout } from '../hooks/useAuth';

export const DashboardContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: sessionsData, isLoading } = useUserSessions();
  const logoutMutation = useLogout();

  const handleCreateSession = () => {
    navigate('/sessions/create');
  };

  const handleNavigateToSession = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`);
  };

  const handleLogout = () => {
    logoutMutation();
    navigate('/login');
  };

  return (
    <PageLayout>
      <DashboardPage
        userName={user?.name || 'Anonyme'}
        sessions={sessionsData?.sessions || []}
        isLoading={isLoading}
        onCreateSession={handleCreateSession}
        onNavigateToSession={handleNavigateToSession}
        onLogout={handleLogout}
      />
    </PageLayout>
  );
};
