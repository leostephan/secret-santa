/**
 * Composant Button pur
 */

import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  padding: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return `${theme.spacing.sm} ${theme.spacing.md}`;
      case 'large':
        return `${theme.spacing.md} ${theme.spacing.xl}`;
      default:
        return `${theme.spacing.sm} ${theme.spacing.lg}`;
    }
  }};
  font-size: ${({ size }) => {
    switch (size) {
      case 'small':
        return '14px';
      case 'large':
        return '18px';
      default:
        return '16px';
    }
  }};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  background-color: ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return theme.colors.secondary;
      case 'outline':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  }};

  color: ${({ variant, theme }) => {
    return variant === 'outline' ? theme.colors.primary : '#FFFFFF';
  }};

  border: ${({ variant, theme }) => {
    return variant === 'outline' ? `2px solid ${theme.colors.primary}` : 'none';
  }};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Button = ({
  variant = 'primary',
  size = 'medium',
  type = 'button',
  ...props
}: ButtonProps) => {
  return <StyledButton variant={variant} size={size} type={type} {...props} />;
};
