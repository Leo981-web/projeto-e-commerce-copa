import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme, StatusBar } from 'react-native';

// ThemeContext.js
export const PALETTES = {
  dark: {
    bg: "#0A3214",
    card: "#122617",
    textPrimary: "#E2E8F0",
    titlePrimary: "#FFFFFF",
    textMuted: "#6B7280",
    divider: "#1A3621",
    iconBg: "#1C3D25",
    iconDestructiveBg: "#3A1E1E",
    textDestructive: "#EF4444",
    navActive: "#22C55E",
    navInactive: "#374151",
    // Em dark mode a barra de pesquisa/rodapé seguem o mesmo tom dos cards
    surfaceAccent: "#122617",
    statusBar: "light-content",
  },
  light: {
    bg: "#EAF6EE",        // fundo verde claro (apenas no modo light)
    card: "#FFFFFF",
    textPrimary: "#1E293B",
    titlePrimary: "#0F172A",
    textMuted: "#64748B",
    divider: "#E2E8F0",
    iconBg: "#F1F5F9",
    iconDestructiveBg: "#FEE2E2",
    textDestructive: "#DC2626",
    navActive: "#15622A",
    navInactive: "#94A3B8",
    // Verde mais escuro que o fundo, usado para dar destaque à busca e ao rodapé
    surfaceAccent: "#BFE6CB",
    statusBar: "dark-content",
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 1. Detecta o tema padrão do sistema do celular (pode retornar 'light' ou 'dark')
  const systemColorScheme = useColorScheme();
  
  
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

 
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const theme = isDarkMode ? PALETTES.dark : PALETTES.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />
      {children}
    </ThemeContext.Provider>
  );
}


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