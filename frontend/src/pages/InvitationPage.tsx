/**
 * Page d'invitation pure (présentation uniquement)
 * Accessible sans authentification
 */

import { useState } from "react";
import styled from "styled-components";
import { Button, Input, Card, Loading } from "../components";
import { motion } from "framer-motion";

interface InvitationPageProps {
  sessionName: string;
  participantCount: number;
  hasDrawn: boolean;
  assignedToName: string | null;
  onViewAssignment: (email: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
  onJoinAsAuthenticatedUser: () => void;
  isLoading: boolean;
  isDrawing: boolean;
  isRegistering: boolean;
  isJoining: boolean;
  error: string | null;
  registerError: string | null;
  joinError: string | null;
  isAuthenticated: boolean;
  userName?: string;
}

const CenteredCard = styled(Card)`
  max-width: 500px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ErrorText = styled(motion.div)`
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ResultCard = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primaryLight} 0%,
    ${({ theme }) => theme.colors.primary} 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
  color: white;
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const ResultTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const AssignedName = styled.div`
  font-size: 36px;
  font-weight: 700;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const InfoBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InfoText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 1.6;
`;

const SessionInfo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SessionName = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ParticipantInfo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

export const InvitationPage = ({
  sessionName,
  participantCount,
  hasDrawn,
  assignedToName,
  onViewAssignment,
  onRegister,
  onJoinAsAuthenticatedUser,
  isLoading,
  isDrawing,
  isRegistering,
  isJoining,
  error,
  registerError,
  joinError,
  isAuthenticated,
  userName,
}: InvitationPageProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation de l'email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleViewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onViewAssignment(email);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    onRegister(name, email, password);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <CenteredCard>
      <Title>🎅 Secret Santa</Title>

      <SessionInfo>
        <SessionName>{sessionName}</SessionName>
        <ParticipantInfo>{participantCount} participants</ParticipantInfo>
      </SessionInfo>

      {!hasDrawn && !assignedToName ? (
        <>
          {isAuthenticated ? (
            // Utilisateur authentifié qui n'est pas encore participant
            <>
              <SectionTitle>👋 Bonjour {userName} !</SectionTitle>
              <InfoBox>
                <InfoText>
                  Tu es invité(e) à rejoindre cette session Secret Santa.
                  Clique sur le bouton ci-dessous pour participer !
                </InfoText>
              </InfoBox>
              {joinError && (
                <ErrorText
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {joinError}
                </ErrorText>
              )}
              <Button
                onClick={onJoinAsAuthenticatedUser}
                fullWidth
                disabled={isJoining}
              >
                {isJoining ? "Participation..." : "🎁 Rejoindre la session"}
              </Button>
            </>
          ) : (
            // Utilisateur non authentifié - afficher le formulaire d'inscription
            <>
              <SectionTitle>🎄 Créer un compte et participer</SectionTitle>
              <InfoBox>
                <InfoText>
                  Crée un compte pour participer à cette session et retrouver
                  facilement ton assignation.
                </InfoText>
              </InfoBox>
              <Form onSubmit={handleRegisterSubmit}>
                {registerError && (
                  <ErrorText
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {registerError}
                  </ErrorText>
                )}
                <Input
                  label="Ton nom"
                  type="text"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={setName}
                  fullWidth
                  required
                />
                <Input
                  label="Ton email"
                  type="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={setEmail}
                  fullWidth
                  required
                />
                <Input
                  label="Mot de passe"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={setPassword}
                  fullWidth
                  required
                />
                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  fullWidth
                  required
                />
                {password !== confirmPassword && confirmPassword && (
                  <ErrorText initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Les mots de passe ne correspondent pas
                  </ErrorText>
                )}
                <Button
                  type="submit"
                  fullWidth
                  disabled={
                    isRegistering ||
                    !name.trim() ||
                    !email.trim() ||
                    !isValidEmail(email) ||
                    !password ||
                    !confirmPassword ||
                    password !== confirmPassword
                  }
                >
                  {isRegistering
                    ? "Création..."
                    : "✨ Créer mon compte et participer"}
                </Button>
              </Form>
            </>
          )}
        </>
      ) : assignedToName ? (
        <ResultCard
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ResultTitle>🎁 Tu dois offrir un cadeau à :</ResultTitle>
          <AssignedName>{assignedToName}</AssignedName>
          <InfoText
            style={{ color: "rgba(255,255,255,0.9)", marginTop: "1rem" }}
          >
            📝 Note bien ce nom, tu ne pourras plus le consulter sans ton email
            !
          </InfoText>
        </ResultCard>
      ) : (
        <>
          <Subtitle>Tu as déjà effectué ton tirage</Subtitle>
          <InfoBox>
            <InfoText>
              Entre ton email pour voir à qui tu dois offrir un cadeau
            </InfoText>
          </InfoBox>
          <Form onSubmit={handleViewSubmit}>
            {error && (
              <ErrorText
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </ErrorText>
            )}
            <Input
              label="Ton email"
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={setEmail}
              fullWidth
              required
            />
            <Button type="submit" fullWidth disabled={isDrawing || !email.trim() || !isValidEmail(email)}>
              {isDrawing ? "Chargement..." : "👀 Voir mon assignation"}
            </Button>
          </Form>
        </>
      )}
    </CenteredCard>
  );
};
