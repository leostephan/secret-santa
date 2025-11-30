/**
 * Page d'inscription pure (présentation uniquement)
 */

import { useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Card } from '../components';
import { motion } from 'framer-motion';

interface RegisterPageProps {
  onRegister: (name: string, email: string, password: string) => void;
  onNavigateToLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

const RegisterCard = styled(Card)`
  max-width: 400px;
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

const LoginLink = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};

  button {
    color: ${({ theme }) => theme.colors.primary};
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    text-decoration: underline;
    padding: 0;
  }
`;

export const RegisterPage = ({ onRegister, onNavigateToLogin, isLoading, error }: RegisterPageProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(name, email, password);
  };

  return (
    <RegisterCard>
      <Title>🎄 Créer un compte</Title>
      <Form onSubmit={handleSubmit}>
        {error && (
          <ErrorText
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </ErrorText>
        )}
        <Input
          label="Nom"
          type="text"
          placeholder="Ton nom"
          value={name}
          onChange={setName}
          fullWidth
          required
        />
        <Input
          label="Email"
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
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Inscription...' : "S'inscrire"}
        </Button>
      </Form>
      <LoginLink>
        Déjà un compte ?{' '}
        <button onClick={onNavigateToLogin}>Se connecter</button>
      </LoginLink>
    </RegisterCard>
  );
};
