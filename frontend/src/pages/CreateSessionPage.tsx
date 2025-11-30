/**
 * Page de création de session pure (présentation uniquement)
 */

import { useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Card } from '../components';
import { motion } from 'framer-motion';

interface CreateSessionPageProps {
  onCreateSession: (name: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
}

const FormCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const ErrorText = styled(motion.div)`
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
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

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CreateSessionPage = ({
  onCreateSession,
  onCancel,
  isLoading,
  error,
}: CreateSessionPageProps) => {
  const [sessionName, setSessionName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionName.trim()) {
      onCreateSession(sessionName);
    }
  };

  return (
    <FormCard>
      <Title>🎄 Créer une session Secret Santa</Title>
      <Form onSubmit={handleSubmit}>
        {error && (
          <ErrorText initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            {error}
          </ErrorText>
        )}

        <Input
          label="Nom de la session"
          type="text"
          placeholder="Ex: Noël famille 2025"
          value={sessionName}
          onChange={setSessionName}
          fullWidth
          required
        />

        <InfoBox>
          <InfoText>
            💡 Une fois la session créée, tu pourras partager un lien d'invitation pour que les participants rejoignent avec leur nom et email.
          </InfoText>
        </InfoBox>

        <ButtonRow>
          <Button type="button" variant="outline" onClick={onCancel} fullWidth>
            Annuler
          </Button>
          <Button
            type="submit"
            fullWidth
            disabled={isLoading || !sessionName.trim()}
          >
            {isLoading ? 'Création...' : 'Créer la session'}
          </Button>
        </ButtonRow>
      </Form>
    </FormCard>
  );
};
