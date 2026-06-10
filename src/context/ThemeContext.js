import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme, StatusBar } from 'react-native';

// Suas paletas de cores (Dark e Light)
export const PALETTES = {
  dark: {
    bg: "#121214",
    card: "#1A1A1E",
    textPrimary: "#FFFFFF",
    titlePrimary: "#fff",
    textMuted: "#A1A1AA",
    divider: "#27272A",
    iconBg: "#27272A",
    iconDestructiveBg: "#3A1E1E",
    textDestructive: "#f87171",
    navActive: "#FFFFFF",
    navInactive: "#52525b",
    statusBar: "light-content",
  },
  light: {
    bg: "#F5F1E8", 
    card: "#FFFFFF",
    textPrimary: "#20242c",
    titlePrimary: "#1A237E",
    textMuted: "#888888",
    divider: "#F5F1E8",
    iconBg: "#EEF2FF",
    iconDestructiveBg: "#FFF0ED",
    textDestructive: "#b42318",
    navActive: "#1A237E", 
    navInactive: "#bbb",
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