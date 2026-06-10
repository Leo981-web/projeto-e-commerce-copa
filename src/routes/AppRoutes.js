import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProductCreateScreen from "../screens/app/ProductCreateScreen";
import ProductDetailsScreen from "../screens/app/ProductDetailsScreen";
import ProductEditScreen from "../screens/app/ProductEditScreen";
import ProductListScreen from "../screens/app/ProductListScreen";
import SettingScreen from "../screens/app/SettingsScreen"
import { useTheme } from "../context/ThemeContext";

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
        options={{ headerShown: false}}
      />
    </Stack.Navigator>
  );
}