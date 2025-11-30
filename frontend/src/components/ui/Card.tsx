/**
 * Composant Card pur
 */

import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  hoverable?: boolean;
  onClick?: () => void;
}

const StyledCard = styled(motion.div)<{ $padding: string; $hoverable: boolean }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ $padding, theme }) => {
    switch ($padding) {
      case 'none':
        return '0';
      case 'small':
        return theme.spacing.md;
      case 'large':
        return theme.spacing.xl;
      default:
        return theme.spacing.lg;
    }
  }};
  transition: box-shadow ${({ theme }) => theme.transitions.fast};
  cursor: ${({ $hoverable }) => ($hoverable ? 'pointer' : 'default')};

  ${({ $hoverable, theme }) =>
    $hoverable &&
    `
    &:hover {
      box-shadow: ${theme.shadows.md};
    }
  `}
`;

export const Card = ({
  padding = 'medium',
  hoverable = false,
  children,
  ...props
}: CardProps) => {
  return (
    <StyledCard
      $padding={padding}
      $hoverable={hoverable}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </StyledCard>
  );
};
