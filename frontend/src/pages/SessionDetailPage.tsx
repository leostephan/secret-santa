/**
 * Page de détail de session pure (présentation uniquement)
 */

import { useState } from 'react';
import styled from 'styled-components';
import { Button, Card, Loading, Input } from '../components';
import type { ParticipantDetailInfo, ParticipantInfo } from '../types/api.types';
import { EMOJI } from '@secret-santa/common';

interface SessionDetailPageProps {
  sessionName: string;
  inviteCode: string;
  isStarted: boolean;
  isActive: boolean;
  isCreator: boolean;
  participants: ParticipantDetailInfo[];
  myAssignment?: ParticipantInfo;
  canPick?: boolean;
  onStartSession: () => void;
  onBack: () => void;
  onCopyInviteLink: () => void;
  onUpdateSession: (name: string) => void;
  onDeleteParticipant: (participantId: string) => void;
  onDeleteSession: () => void;
  onPickParticipant: () => void;
  isLoading: boolean;
  isStarting: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isPicking: boolean;
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: ${({ theme }) => theme.spacing.xs};
  opacity: 0.6;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
  }
`;

const EditForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  background-color: ${({ $status, theme }) =>
    $status === 'started' ? theme.colors.secondary : theme.colors.primary};
  color: white;
`;

const InviteSection = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const AssignmentSection = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  color: white;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const AssignmentTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: white;
`;

const AssignmentName = styled.div`
  font-size: 36px;
  font-weight: 900;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const AssignmentEmail = styled.div`
  font-size: 16px;
  opacity: 0.9;
  color: white;
`;

const InviteTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InviteCodeBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InviteCode = styled.code`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 2px;
`;

const InviteText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ParticipantsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ParticipantsList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ParticipantCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ParticipantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ParticipantName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ParticipantEmail = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ParticipantStatus = styled.span<{ $picked: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $picked, theme }) => ($picked ? theme.colors.secondary : theme.colors.text.hint)};
`;

const DeleteButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ParticipantActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SessionDetailPage = ({
  sessionName,
  inviteCode,
  isStarted,
  isActive,
  isCreator,
  participants,
  myAssignment,
  canPick,
  onStartSession,
  onBack,
  onCopyInviteLink,
  onUpdateSession,
  onDeleteParticipant,
  onDeleteSession,
  onPickParticipant,
  isLoading,
  isStarting,
  isUpdating,
  isDeleting,
  isPicking,
}: SessionDetailPageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(sessionName);

  if (isLoading) {
    return <Loading />;
  }

  const pickedCount = participants.filter((p) => p.has_picked).length;
  const inviteUrl = `${window.location.origin}/invite/${inviteCode}`;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedName.trim() && editedName !== sessionName) {
      onUpdateSession(editedName);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(sessionName);
    setIsEditing(false);
  };

  return (
    <>
      <Header>
        <div>
          {isEditing ? (
            <EditForm onSubmit={handleEditSubmit}>
              <Input
                type="text"
                value={editedName}
                onChange={(value) => setEditedName(value)}
                autoFocus
                disabled={isUpdating}
              />
              <Button type="submit" disabled={isUpdating || !editedName.trim()}>
                ✓
              </Button>
              <Button variant="outline" type="button" onClick={handleCancelEdit} disabled={isUpdating}>
                ✗
              </Button>
            </EditForm>
          ) : (
            <Title>
              {EMOJI.SANTA} {sessionName}
              {isCreator && (
                <EditButton onClick={() => setIsEditing(true)} title="Modifier le nom">
                  {EMOJI.EDIT}
                </EditButton>
              )}
            </Title>
          )}
        </div>
        <StatusBadge $status={isStarted ? 'started' : 'pending'}>
          {isStarted ? '✅ En cours' : '⏳ En préparation'}
        </StatusBadge>
      </Header>

      {myAssignment && (
        <AssignmentSection>
          <AssignmentTitle>{EMOJI.GIFT} Ton Secret Santa</AssignmentTitle>
          <p>Tu dois offrir un cadeau à :</p>
          <AssignmentName>{myAssignment.name}</AssignmentName>
          <AssignmentEmail>{myAssignment.email}</AssignmentEmail>
        </AssignmentSection>
      )}

      {canPick && isActive && (
        <InviteSection>
          <InviteTitle>{EMOJI.GIFT} Effectue ton tirage au sort</InviteTitle>
          <InviteText>
            Tu es invité à participer à ce Secret Santa ! Clique sur le bouton ci-dessous pour découvrir à qui tu dois offrir un cadeau.
          </InviteText>
          <Button
            onClick={onPickParticipant}
            disabled={isPicking}
            fullWidth
          >
            {isPicking ? 'Tirage en cours...' : '🎲 Effectuer mon tirage'}
          </Button>
        </InviteSection>
      )}

      {!isStarted && isActive && isCreator && (
        <InviteSection>
          <InviteTitle>{EMOJI.ENVELOPE} Partager l'invitation</InviteTitle>
          <InviteText>
            Partage ce lien avec les participants pour qu'ils puissent effectuer leur tirage au
            sort :
          </InviteText>
          <InviteCodeBox>
            <InviteCode>{inviteCode}</InviteCode>
            <Button variant="secondary" onClick={onCopyInviteLink}>
              📋 Copier le lien
            </Button>
          </InviteCodeBox>
          <InviteText style={{ fontSize: '12px' }}>{inviteUrl}</InviteText>
        </InviteSection>
      )}

      <ParticipantsSection>
        <SectionTitle>
          👥 Participants ({participants.length})
          {isStarted && isCreator && ` - ${pickedCount} tirage${pickedCount > 1 ? 's' : ''} effectué${pickedCount > 1 ? 's' : ''}`}
        </SectionTitle>
        <ParticipantsList>
          {participants.map((participant) => (
            <ParticipantCard key={participant.id} padding="medium">
              <ParticipantInfo>
                <ParticipantName>{participant.name}</ParticipantName>
                <ParticipantEmail>{participant.email}</ParticipantEmail>
              </ParticipantInfo>
              <ParticipantActions>
                {isStarted && isCreator && (
                  <ParticipantStatus $picked={participant.has_picked}>
                    {participant.has_picked ? '✅ Tirage fait' : '⏳ En attente'}
                  </ParticipantStatus>
                )}
                {isCreator && (
                  <DeleteButton
                    onClick={() => onDeleteParticipant(participant.id)}
                    disabled={isDeleting}
                  >
                    🗑️ Supprimer
                  </DeleteButton>
                )}
              </ParticipantActions>
            </ParticipantCard>
          ))}
        </ParticipantsList>
      </ParticipantsSection>

      <Actions>
        <Button variant="outline" onClick={onBack}>
          ← Retour au dashboard
        </Button>
        {!isStarted && isActive && isCreator && (
          <Button onClick={onStartSession} disabled={isStarting}>
            {isStarting ? 'Démarrage...' : '🎉 Démarrer la session'}
          </Button>
        )}
        {isActive && isCreator && (
          <Button variant="outline" onClick={onDeleteSession} disabled={isDeleting}>
            {isDeleting ? 'Suppression...' : '🗑️ Supprimer la session'}
          </Button>
        )}
      </Actions>
    </>
  );
};
