import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

const Email = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [sellerId, setSellerId] = useState(null);

  // Carregar o ID do vendedor do AsyncStorage
  useEffect(() => {
    const fetchSellerId = async () => {
      try {
        const id = await AsyncStorage.getItem("sellerId");
        if (id) {
          console.log("Seller ID:", id);
          setSellerId(id);
        }
      } catch (error) {
        Alert.alert("Error", "Error loading seller ID.");
      }
    };
    fetchSellerId();
  }, []);

  // Função para atualizar o email do vendedor no arquivo JSON
  const updateEmailInJson = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      // Verificar se o email foi fornecido
      if (!email) {
        Alert.alert("Error", "Please enter a valid email address.");
        return;
      }

      // Recuperar o sellerId armazenado no AsyncStorage
      const sellerId = await AsyncStorage.getItem("sellerId");
      console.log("Seller ID recuperado:", sellerId);

      if (!sellerId) {
        Alert.alert("Error", "Seller ID not found.");
        return;
      }

      // Enviar o id e o email para o backend para atualização
      const updateResponse = await axios.put(
        `${API_URL}/psychics-json`,
        { id: sellerId, email: email } // Envia somente o id e o novo email
      );

      // Verificar a resposta do servidor
      console.log("Resposta da atualização:", updateResponse.data);

      // Salvar o email no AsyncStorage
      await AsyncStorage.setItem("email", email);

      // Navegar para a próxima página (Photos)
      navigation.navigate("Photos");
    } catch (error) {
      console.error("Erro ao atualizar o email:", error);
      Alert.alert("Error", "Error saving the email.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Update Email</Text>
        <Text style={styles.subtitle}>
          Please enter your email address to receive updates and notifications.
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity
          style={styles.updateButton}
          onPress={updateEmailInJson}
        >
          <Text style={styles.buttonText} onPress={updateEmailInJson}>
            Update Email
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  updateButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    elevation: 3, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Email;
