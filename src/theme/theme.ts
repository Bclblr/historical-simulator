import { palette } from './palette';
import { radius, spacing, typography } from './tokens';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  primary: string;
  onPrimary: string;
  accent: string;
  danger: string;
}

export interface AppTheme {
  dark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

export const lightTheme: AppTheme = {
  dark: false,
  colors: {
    background: palette.paper100,
    surface: palette.paper200,
    surfaceElevated: palette.paper50,
    border: palette.paper300,
    text: palette.ink900,
    textMuted: palette.ink600,
    textSubtle: palette.ink500,
    primary: palette.ink900,
    onPrimary: palette.paper50,
    accent: palette.accent700,
    danger: palette.danger700,
  },
  spacing,
  radius,
  typography,
};

export const darkTheme: AppTheme = {
  dark: true,
  colors: {
    background: palette.night950,
    surface: palette.night900,
    surfaceElevated: palette.night800,
    border: palette.night700,
    text: palette.night100,
    textMuted: palette.night300,
    textSubtle: palette.night500,
    primary: palette.night100,
    onPrimary: palette.night950,
    accent: palette.accent300,
    danger: palette.danger300,
  },
  spacing,
  radius,
  typography,
};
