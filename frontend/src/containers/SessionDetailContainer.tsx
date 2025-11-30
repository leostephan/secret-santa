/**
 * Container de détail de session
 * Gère la logique métier et passe uniquement des scalaires au composant pur
 */

import { useNavigate, useParams } from 'react-router-dom';
import { SessionDetailPage } from '../pages/SessionDetailPage';
import { PageLayout } from '../components';
import {
  useSession,
  useStartSession,
  useUpdateSession,
  useDeleteParticipant,
  useDeleteSession,
  usePickParticipant,
} from '../hooks/useSessions';
import { Loading } from '../components';
import { SUCCESS_MESSAGES } from '@secret-santa/common';
import { useAuth } from '../contexts/AuthContext';

export const SessionDetailContainer = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data, isLoading } = useSession(id);
  const startMutation = useStartSession(id!);
  const updateMutation = useUpdateSession(id!);
  const deleteParticipantMutation = useDeleteParticipant(id!);
  const deleteSessionMutation = useDeleteSession();
  const pickMutation = usePickParticipant(id!);

  const handleStartSession = async () => {
    try {
      await startMutation.mutateAsync();
    } catch {
      // L'erreur est déjà gérée par React Query
    }
  };

  const handleUpdateSession = async (name: string) => {
    try {
      await updateMutation.mutateAsync(name);
    } catch {
      // L'erreur est déjà gérée par React Query
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/invite/${data?.session.invite_code}`;
    navigator.clipboard.writeText(inviteUrl);
    alert(SUCCESS_MESSAGES.INVITE_LINK_COPIED);
  };

  const handleDeleteParticipant = async (participantId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce participant ?')) {
      try {
        await deleteParticipantMutation.mutateAsync(participantId);
      } catch {
        // L'erreur est déjà gérée par React Query
      }
    }
  };

  const handleDeleteSession = async () => {
    if (
      window.confirm(
        'Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible.'
      )
    ) {
      try {
        await deleteSessionMutation.mutateAsync(id!);
        navigate('/dashboard');
      } catch {
        // L'erreur est déjà gérée par React Query
      }
    }
  };

  const handlePickParticipant = async () => {
    if (!user?.email || !user?.name) return;

    try {
      await pickMutation.mutateAsync({ name: user.name, email: user.email });
    } catch {
      // L'erreur est déjà gérée par React Query
    }
  };

  if (isLoading || !data) {
    return (
      <PageLayout>
        <Loading />
      </PageLayout>
    );
  }

  // Vérifier si l'utilisateur est participant et n'a pas encore tiré
  const userParticipant = user?.email
    ? data.participants.find(p => p.email === user.email)
    : undefined;
  const canPick = !data.is_creator && userParticipant && !userParticipant.has_picked && !data.my_assignment;

  return (
    <PageLayout>
      <SessionDetailPage
        sessionName={data.session.name}
        inviteCode={data.session.invite_code}
        isStarted={data.session.is_started}
        isActive={data.session.is_active}
        isCreator={data.is_creator}
        participants={data.participants}
        myAssignment={data.my_assignment}
        canPick={canPick}
        onStartSession={handleStartSession}
        onBack={handleBack}
        onCopyInviteLink={handleCopyInviteLink}
        onUpdateSession={handleUpdateSession}
        onDeleteParticipant={handleDeleteParticipant}
        onDeleteSession={handleDeleteSession}
        onPickParticipant={handlePickParticipant}
        isLoading={false}
        isStarting={startMutation.isPending}
        isUpdating={updateMutation.isPending}
        isDeleting={deleteParticipantMutation.isPending || deleteSessionMutation.isPending}
        isPicking={pickMutation.isPending}
      />
    </PageLayout>
  );
};
