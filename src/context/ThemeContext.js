import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme, StatusBar } from 'react-native';

// ThemeContext.js
export const PALETTES = {
  dark: {
    bg: "#0A3214",            // Verde quase preto de fundo
    card: "#122617",          // Verde escuro fechado para os cards
    textPrimary: "#E2E8F0",
    titlePrimary: "#FFFFFF",
    textMuted: "#6B7280",
    divider: "#1A3621",       // Bordas sutis integradas ao verde
    iconBg: "#1C3D25",
    iconDestructiveBg: "#3A1E1E",
    textDestructive: "#EF4444",
    navActive: "#22C55E",     // Verde vivo para destaque
    navInactive: "#374151",
    statusBar: "light-content",
  },
  light: {
    bg: "#fff",            // Off-white levemente areia (fundo clássico Copa)
    card: "#FFFFFF",
    textPrimary: "#1E293B",
    titlePrimary: "#0F172A",
    textMuted: "#64748B",
    divider: "#E2E8F0",
    iconBg: "#F1F5F9",
    iconDestructiveBg: "#FEE2E2",
    textDestructive: "#DC2626",
    navActive: "#15622A",     // Verde oficial
    navInactive: "#94A3B8",
    statusBar: "dark-content",
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 1. Detecta o tema padrão do sistema do celular (pode retornar 'light' ou 'dark')
  const systemColorScheme = useColorScheme();
  
  // 2. Inicializa o estado do app com base no sistema do celular
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Opcional: Sincroniza o app caso o usuário mude o tema do celular na barra de notificações
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const theme = isDarkMode ? PALETTES.dark : PALETTES.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {/* Controla a barra de status superior do celular de forma global */}
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar o tema de forma simples em qualquer tela
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    return {
      isDarkMode: false,
      theme: PALETTES.light,
      toggleTheme: () => {},
    };
  }

  return context;
}