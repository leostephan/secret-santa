/**
 * Container de création de session
 * Gère la logique métier et passe uniquement des scalaires au composant pur
 */

import { useNavigate } from 'react-router-dom';
import { CreateSessionPage } from '../pages/CreateSessionPage';
import { PageLayout } from '../components';
import { useCreateSession } from '../hooks/useSessions';

export const CreateSessionContainer = () => {
  const navigate = useNavigate();
  const createMutation = useCreateSession();

  const handleCreateSession = async (name: string) => {
    try {
      const response = await createMutation.mutateAsync({ name });
      navigate(`/sessions/${response.session.id}`);
    } catch {
      // L'erreur est déjà gérée par React Query
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const errorMessage = createMutation.error instanceof Error ? createMutation.error.message : null;

  return (
    <PageLayout title="Nouvelle session">
      <CreateSessionPage
        onCreateSession={handleCreateSession}
        onCancel={handleCancel}
        isLoading={createMutation.isPending}
        error={errorMessage}
      />
    </PageLayout>
  );
};
