/**
 * Composant Loading pur
 */

import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div<{ $size?: number }>`
  border: 3px solid ${({ theme }) => theme.colors.text.disabled};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: ${({ $size }) => $size || 40}px;
  height: ${({ $size }) => $size || 40}px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

interface LoadingProps {
  size?: number;
}

export const Loading = ({ size }: LoadingProps) => {
  return (
    <LoadingWrapper>
      <LoadingSpinner $size={size} />
    </LoadingWrapper>
  );
};
