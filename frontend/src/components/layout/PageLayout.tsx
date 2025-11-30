/**
 * Composant PageLayout pur
 */

import styled from 'styled-components';
import { Wrapper } from './Wrapper';

interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

export const PageLayout = ({ title, children }: PageLayoutProps) => {
  return (
    <PageWrapper>
      <Wrapper>
        {title && <Title>{title}</Title>}
        {children}
      </Wrapper>
    </PageWrapper>
  );
};
