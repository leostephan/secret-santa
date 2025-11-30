/**
 * Page Dashboard pure (présentation uniquement)
 */

import styled from "styled-components";
import { Button, Card, Loading } from "../components";
import type { SessionBasicInfo } from "../types/api.types";

interface DashboardPageProps {
  userName: string;
  sessions: SessionBasicInfo[];
  isLoading: boolean;
  onCreateSession: () => void;
  onNavigateToSession: (sessionId: string) => void;
  onLogout: () => void;
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SessionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SessionCard = styled(Card)`
  cursor: pointer;
`;

const SessionName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SessionInfo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SessionStatus = styled.span<{ $status: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ $status, theme }) =>
    $status === "started" ? theme.colors.secondary : theme.colors.primary};
  color: white;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.secondary};

  h3 {
    font-size: 24px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  p {
    font-size: 16px;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:first-of-type {
    margin-top: 0;
  }
`;

const SessionSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

export const DashboardPage = ({
  userName,
  sessions,
  isLoading,
  onCreateSession,
  onNavigateToSession,
  onLogout,
}: DashboardPageProps) => {
  if (isLoading) {
    return <Loading />;
  }

  const createdSessions = sessions.filter((s) => s.is_creator);
  const participantSessions = sessions.filter((s) => !s.is_creator);

  return (
    <>
      <Header>
        <Title>🎅 Bonjour {userName} !</Title>
        <Actions>
          <Button variant="secondary" onClick={onCreateSession}>
            + Nouvelle session
          </Button>
          <Button variant="outline" onClick={onLogout}>
            Déconnexion
          </Button>
        </Actions>
      </Header>

      {sessions.length === 0 ? (
        <EmptyState>
          <h3>🎄 Aucune session</h3>
          <p>Crée ta première session Secret Santa pour commencer !</p>
          <Button onClick={onCreateSession}>Créer une session</Button>
        </EmptyState>
      ) : (
        <>
          {createdSessions.length > 0 && (
            <SessionSection>
              <SectionTitle>
                🎅 Mes sessions ({createdSessions.length})
              </SectionTitle>
              <SessionsGrid>
                {createdSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    hoverable
                    onClick={() => onNavigateToSession(session.id)}
                  >
                    <SessionName>{session.name}</SessionName>
                    <SessionInfo>
                      {session.participant_count || 0} participant
                      {(session.participant_count || 0) > 1 ? "s" : ""}
                    </SessionInfo>
                    <SessionStatus
                      $status={session.is_started ? "started" : "pending"}
                    >
                      {session.is_started ? "En cours" : "En préparation"}
                    </SessionStatus>
                  </SessionCard>
                ))}
              </SessionsGrid>
            </SessionSection>
          )}

          {participantSessions.length > 0 && (
            <SessionSection>
              <SectionTitle>
                🎁 Sessions où je participe ({participantSessions.length})
              </SectionTitle>
              <SessionsGrid>
                {participantSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    hoverable
                    onClick={() => onNavigateToSession(session.id)}
                  >
                    <SessionName>{session.name}</SessionName>
                    <SessionInfo>
                      {session.participant_count || 0} participant
                      {(session.participant_count || 0) > 1 ? "s" : ""}
                    </SessionInfo>
                    <SessionStatus
                      $status={session.is_started ? "started" : "pending"}
                    >
                      {session.is_started ? "En cours" : "En préparation"}
                    </SessionStatus>
                  </SessionCard>
                ))}
              </SessionsGrid>
            </SessionSection>
          )}
        </>
      )}
    </>
  );
};
