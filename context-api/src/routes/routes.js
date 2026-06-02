import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Home from "../screens/Home";

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: "Login",
        }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Início",
        }}
      />
    </Stack.Navigator>
  );
}
