import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProductCreateScreen from "../screens/app/ProductCreateScreen";
import ProductDetailsScreen from "../screens/app/ProductDetailsScreen";
import ProductEditScreen from "../screens/app/ProductEditScreen";
import ProductListScreen from "../screens/app/ProductListScreen";
import FavoriteScreen from "../screens/app/FavoriteScreen";
import SettingScreen from "../screens/app/SettingsScreen";
import ProfileScreen from "../screens/app/ProfileScreen";
import { useTheme } from "../context/ThemeContext";
import CartScreen from "../screens/app/CartScreen";
import SupportScreen from "../screens/app/SupportScreen";
import AboutScreen from "../screens/app/AboutScreen";
import PaymentScreen from "../screens/app/PaymentScreen";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: theme.bg },
        headerStyle: { backgroundColor: theme.bg },
        headerShadowVisible: false,
        headerTitleStyle: {
          color: theme.textPrimary,
          fontWeight: "800",
        },
      }}
    >
      <Stack.Screen
        name="Products"
        component={ProductListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoriteScreen}
        options={{ headerShown: false }}
      />
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
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
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
        name="Support"
        component={SupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}