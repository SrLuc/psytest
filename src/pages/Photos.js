import React, { useState } from "react";
import { View, Image, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

const Photos = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);

  // Função para abrir a galeria e pegar uma foto
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        aspect: [4, 4],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0]); // Atualiza o estado com a imagem selecionada
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Função para salvar a foto e o ID no backend
  const handleSavePhoto = async () => {
    if (!photo) {
      return;
    }

    try {
      // Recuperar o sellerId armazenado
      const sellerId = await AsyncStorage.getItem("sellerId");
      // Enviar os dados para o backend
      const formData = new FormData();
      formData.append("id", sellerId);
      formData.append("photo", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });

      // Enviar a imagem e o id para o backend
      const updateResponse = await axios.put(
        `${API_URL}/psychics-photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Resposta da atualização:", updateResponse.data);

      // Navegar para a próxima página (Expertise)
      navigation.navigate("Expertise");
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Photo</Text>
      <Text style={styles.subtitle}>
        Please upload a clear photo of yourself. This will be displayed on your
        profile.
      </Text>

      {/* Exibição da foto selecionada */}
      <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Tap to select a photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Botão para salvar a foto */}
      <TouchableOpacity
        style={[styles.button, !photo && styles.buttonDisabled]}
        onPress={handleSavePhoto}
        disabled={!photo}
      >
        <Text style={styles.buttonText}>Save Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Photos;
