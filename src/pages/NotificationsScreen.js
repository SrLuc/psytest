import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importe o Async Storage

const NotificationsScreen = ({ navigation }) => {
  const requestNotificationsPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      await Notifications.requestPermissionsAsync();
    }

    // Recupera o token do Async Storage
    try {
      const userToken = await AsyncStorage.getItem("sellerId"); // Substitua "userToken" pela chave usada para salvar o token
      if (userToken) {
        // Navega para a tela de perfil passando o token como parâmetro
        navigation.navigate("Profile", { token: userToken });
      } else {
        alert("Token not found. Please log in again.");
        navigation.navigate("Login"); // Substitua "Login" pela tela de login do seu app
      }
    } catch (error) {
      console.error("Error retrieving token from Async Storage:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Please enable notifications to stay updated on your profile.
      </Text>
      <Button
        mode="contained"
        onPress={requestNotificationsPermission}
        style={styles.button}
      >
        Activate Notifications
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6200ee",
  },
});

export default NotificationsScreen;
