import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "./src/context/AuthContext";
import { CustomAlertProvider } from "./src/context/CustomAlertContext";
import Routes from "./src/routes/Routes";
import { LanguageProvider } from "./src/context/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <CustomAlertProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
        <StatusBar style="auto" />
      </CustomAlertProvider>
    </AuthProvider>
    </LanguageProvider>
  );
}
