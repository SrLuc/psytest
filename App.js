import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Provider as PaperProvider } from "react-native-paper";

import Sellers from "./src/pages/Sellers";
import VerifyCode from "./src/pages/VerifyCode";
import Email from "./src/pages/Email";
import Photos from "./src/pages/Photos";
import Expertise from "./src/pages/Expertise";
import Step1 from "./src/pages/UI/Step1";
import Step2 from "./src/pages/UI/Step2";
import Profile from "./src/pages/Profile";
import NotificationsScreen from "./src/pages/NotificationsScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Sellers" component={Sellers} />
          <Stack.Screen name="VerifyCode" component={VerifyCode} />
          <Stack.Screen name="Email" component={Email} />
          <Stack.Screen name="Photos" component={Photos} />
          <Stack.Screen name="Expertise" component={Expertise} />
          <Stack.Screen name="Step1" component={Step1} />
          <Stack.Screen name="Step2" component={Step2} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
