import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProductCreateScreen from "../screens/app/ProductCreateScreen";
import ProductDetailsScreen from "../screens/app/ProductDetailsScreen";
import ProductEditScreen from "../screens/app/ProductEditScreen";
import ProductListScreen from "../screens/app/ProductListScreen";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: "#f5f1ea" },
        headerStyle: { backgroundColor: "#f5f1ea" },
        headerShadowVisible: false,
        headerTitleStyle: {
          color: "#20242c",
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
    </Stack.Navigator>
  );
}
