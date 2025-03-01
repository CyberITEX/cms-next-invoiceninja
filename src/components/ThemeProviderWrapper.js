'use client';

import { ThemeProvider } from '@/hooks/useTheme';

export default function ThemeProviderWrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}