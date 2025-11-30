/**
 * Composant Input pur
 */

import styled from 'styled-components';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  value: string;
  onChange: (value: string) => void;
}

const InputWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 16px;
  border: 2px solid ${({ $hasError, theme }) =>
    $hasError ? theme.colors.error : theme.colors.text.disabled};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: border-color ${({ theme }) => theme.transitions.fast};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.hint};
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
`;

export const Input = ({
  label,
  error,
  fullWidth,
  value,
  onChange,
  ...props
}: InputProps) => {
  return (
    <InputWrapper $fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <StyledInput
        $hasError={!!error}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputWrapper>
  );
};
