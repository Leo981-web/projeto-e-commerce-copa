import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

import ProductCreateScreen from "../screens/app/ProductCreateScreen";
import ProductDetailsScreen from "../screens/app/ProductDetailsScreen";
import ProductEditScreen from "../screens/app/ProductEditScreen";
import ProductListScreen from "../screens/app/ProductListScreen";
import FavoriteScreen from "../screens/app/FavoriteScreen";
import SettingScreen from "../screens/app/SettingsScreen";
import ProfileScreen from "../screens/app/ProfileScreen";
import CartScreen from "../screens/app/CartScreen";
import SupportScreen from "../screens/app/SupportScreen";
import AboutScreen from "../screens/app/AboutScreen";
import PaymentScreen from "../screens/app/PaymentScreen";
import ReceiptScreen from "../screens/app/ReceiptScreen";
import HistoryScreen from "../screens/app/HistoryScreen";
import TermserviceScreen from "../screens/app/TermserviceScreen";
import NotificationScreen from "../screens/app/NotificationScreen";
import UnauthorizedScreen from "../screens/app/UnauthorizedScreen";
import ReviewsScreen from "../screens/app/ReviewsScreen";
import AddressesScreen from "../screens/app/AddressesScreen";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();

  const screenOptions = {
    contentStyle: { backgroundColor: theme.bg },
    headerStyle: { backgroundColor: theme.bg },
    headerShadowVisible: false,
    headerTitleStyle: {
      color: theme.textPrimary,
      fontWeight: "800",
    },
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {/* ── Tela inicial ──────────────────────────────────────────────── */}
      <Stack.Screen
        name="Products"
        component={ProductListScreen}
        options={{ headerShown: false }}
      />

      {/* ── Acessíveis a todos (Common e Admin) ───────────────────────── */}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoriteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "Meus Pedidos",
          headerShown: true,
          headerStyle: { backgroundColor: theme.bg },
          headerTintColor: theme.textPrimary,
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: "Pagamento" }}
      />
      <Stack.Screen
        name="Receipt"
        component={ReceiptScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Termservice"
        component={TermserviceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Addresses"
        component={AddressesScreen}
        options={{ headerShown: false }}
      />

      {/* ── Tela de acesso negado (fallback para Common que tenta navegar) */}
      <Stack.Screen
        name="Unauthorized"
        component={UnauthorizedScreen}
        options={{ headerShown: false }}
      />

      {/* ── Exclusivas de Admin ───────────────────────────────────────── */}
      {isAdmin && (
        <>
          <Stack.Screen
            name="ProductCreate"
            component={ProductCreateScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductEdit"
            component={ProductEditScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}