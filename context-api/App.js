import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import Routes from "./src/routes/routes";
import { AuthProvider } from "./src/context/AuthProvider";
import { ThemeProvider } from "./src/context/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}
