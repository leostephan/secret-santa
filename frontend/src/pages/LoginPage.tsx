/**
 * Page de connexion pure (présentation uniquement)
 */

import { useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Card } from '../components';
import { motion } from 'framer-motion';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
  isLoading: boolean;
  error: string | null;
}

const LoginCard = styled(Card)`
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

const RegisterLink = styled.div`
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

export const LoginPage = ({ onLogin, onNavigateToRegister, isLoading, error }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <LoginCard>
      <Title>🎅 Connexion Secret Santa</Title>
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
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </Form>
      <RegisterLink>
        Pas encore de compte ?{' '}
        <button onClick={onNavigateToRegister}>S'inscrire</button>
      </RegisterLink>
    </LoginCard>
  );
};
