/**
 * Composant Wrapper pur
 */

import styled from 'styled-components';

interface WrapperProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  children: React.ReactNode;
}

const StyledWrapper = styled.div<{ $maxWidth: string; $centered: boolean }>`
  width: 100%;
  max-width: ${({ $maxWidth }) => {
    switch ($maxWidth) {
      case 'sm':
        return '640px';
      case 'md':
        return '768px';
      case 'lg':
        return '1024px';
      case 'xl':
        return '1280px';
      default:
        return '1024px';
    }
  }};
  margin: ${({ $centered }) => ($centered ? '0 auto' : '0')};
  padding: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

export const Wrapper = ({ maxWidth = 'lg', centered = true, children }: WrapperProps) => {
  return (
    <StyledWrapper $maxWidth={maxWidth} $centered={centered}>
      {children}
    </StyledWrapper>
  );
};
