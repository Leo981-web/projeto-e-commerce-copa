import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "./src/context/AuthContext";
import { CustomAlertProvider } from "./src/context/CustomAlertContext";
import Routes from "./src/routes/Routes";
import { LanguageProvider } from "./src/context/LanguageContext";
import { CartProvider } from "./src/context/CartContext";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <CustomAlertProvider>
            <NavigationContainer>
              <Routes />
            </NavigationContainer>
            <StatusBar style="auto" />
          </CustomAlertProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
