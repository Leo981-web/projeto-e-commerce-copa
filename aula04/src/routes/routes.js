import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProductList from "../screens/ProductList";

const AppStack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <AppStack.Navigator>
        <AppStack.Screen
          name="ProductList"
          component={ProductList}
          options={{
            headerTitle: "Lista de Produtos",
            headerTitleAlign: "center",
          }}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
