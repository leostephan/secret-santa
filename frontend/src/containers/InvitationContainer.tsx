/**
 * Container d'invitation (page publique)
 * Gère la logique métier et passe uniquement des scalaires au composant pur
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InvitationPage } from "../pages/InvitationPage";
import { PageLayout } from "../components";
import {
  useSessionByInviteCode,
  usePickParticipant,
  useAssignment,
  useJoinSession,
  useJoinSessionAuthenticated,
} from "../hooks/useSessions";
import { useRegister } from "../hooks/useAuth";
import { Loading } from "../components";
import { useAuth } from "../contexts/AuthContext";

export const InvitationContainer = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [assignedToName, setAssignedToName] = useState<string | null>(null);

  const { data, isLoading } = useSessionByInviteCode(code || "");
  const pickMutation = usePickParticipant(data?.session.id || "");
  const assignmentMutation = useAssignment(data?.session.id || "");
  const registerMutation = useRegister();
  const joinMutation = useJoinSession(data?.session.id || "");
  const joinAuthenticatedMutation = useJoinSessionAuthenticated(data?.session.id || "");

  // Vérifier si l'utilisateur connecté participe déjà à la session
  const isAlreadyParticipant = isAuthenticated && user && data
    ? data.participants.some(p => p.email === user.email)
    : false;

  // Rediriger automatiquement si l'utilisateur est déjà participant
  useEffect(() => {
    if (isAuthenticated && isAlreadyParticipant && data?.session.id) {
      navigate(`/session/${data.session.id}`);
    }
  }, [isAuthenticated, isAlreadyParticipant, data?.session.id, navigate]);

  const handleViewAssignment = async (email: string) => {
    try {
      const response = await assignmentMutation.mutateAsync(email);
      setAssignedToName(response.assigned_to.name);
    } catch {
      // L'erreur est déjà gérée par React Query
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      // 1. Créer le compte utilisateur (ceci met à jour le contexte d'auth via onSuccess)
      await registerMutation.mutateAsync({ name, email, password });

      // 2. Ajouter l'utilisateur authentifié à la session
      if (data?.session.id) {
        await joinAuthenticatedMutation.mutateAsync();

        // 3. Rediriger vers la page de détail de la session
        navigate(`/session/${data.session.id}`);
      }
    } catch (error) {
      // L'erreur est déjà gérée par React Query
      console.error("Erreur lors de l'inscription:", error);
    }
  };

  const handleJoinAsAuthenticatedUser = async () => {
    try {
      if (data?.session.id && user) {
        // Vérifier si l'utilisateur est déjà participant avant d'essayer de rejoindre
        if (isAlreadyParticipant) {
          navigate(`/session/${data.session.id}`);
          return;
        }

        await joinAuthenticatedMutation.mutateAsync();
        navigate(`/session/${data.session.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la participation:", error);
    }
  };  if (isLoading || !data) {
    return (
      <PageLayout>
        <Loading />
      </PageLayout>
    );
  }

  const errorMessage =
    (pickMutation.error instanceof Error ? pickMutation.error.message : null) ||
    (assignmentMutation.error instanceof Error
      ? assignmentMutation.error.message
      : null) ||
    (joinMutation.error instanceof Error ? joinMutation.error.message : null) ||
    (joinAuthenticatedMutation.error instanceof Error ? joinAuthenticatedMutation.error.message : null);

  const registerErrorMessage =
    registerMutation.error instanceof Error
      ? registerMutation.error.message
      : null;

  const joinErrorMessage =
    (joinMutation.error instanceof Error ? joinMutation.error.message : null) ||
    (joinAuthenticatedMutation.error instanceof Error ? joinAuthenticatedMutation.error.message : null);

  return (
    <PageLayout>
      <InvitationPage
        sessionName={data.session.name}
        participantCount={data.participants.length}
        hasDrawn={false} // On ne peut pas savoir côté client avant le tirage
        assignedToName={assignedToName}
        onViewAssignment={handleViewAssignment}
        onRegister={handleRegister}
        onJoinAsAuthenticatedUser={handleJoinAsAuthenticatedUser}
        isLoading={isLoading}
        isDrawing={pickMutation.isPending || assignmentMutation.isPending}
        isRegistering={registerMutation.isPending}
        isJoining={joinMutation.isPending || joinAuthenticatedMutation.isPending}
        error={errorMessage}
        registerError={registerErrorMessage}
        joinError={joinErrorMessage}
        isAuthenticated={isAuthenticated}
        userName={user?.name}
      />
    </PageLayout>
  );
};
