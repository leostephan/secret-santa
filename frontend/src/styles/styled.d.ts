/**
 * Déclaration TypeScript pour styled-components
 * Définit le type du thème pour avoir l'autocomplétion
 */

import 'styled-components';
import { theme } from './theme';

type ThemeType = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
