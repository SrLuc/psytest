import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import { Checkbox, Modal, Portal, Button, Provider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import axios from "axios";
import { API_URL } from "@env";

const Expertise = ({ navigation }) => {
  const [id, setId] = useState(null); // Estado para armazenar o id
  const [expertises, setExpertises] = useState({
    Psychic: false,
    Astrology: false,
    Tarot: false,
    Love: false,
    Money: false,
    Life: false,
    Spiritual: false,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false); // Modal para ativar notificações

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sellerId = await AsyncStorage.getItem("sellerId");
        console.log("Seller Id do Componente Expertise", sellerId);
        if (!sellerId) {
          Alert.alert("Error", "Seller ID not found.");
          return;
        }
        setId(sellerId);
      } catch (error) {
        console.error("Error fetching sellerId:", error);
        Alert.alert("Error", "Erro ao carregar dados do usuário.");
      }
    };

    fetchUserData();
  }, []);

  const handleToggle = (expertise) => {
    setExpertises((prev) => ({
      ...prev,
      [expertise]: !prev[expertise],
    }));
    console.log("Expertises do Toggle:", expertises);
  };

  const requestNotificationsPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        Alert.alert(
          "Attention",
          "The notifications permission is required to stay updated."
        );
      }
    }
  };

  const handleSave = async () => {
    const selectedExpertises = Object.keys(expertises).filter(
      (key) => expertises[key]
    );

    if (!selectedExpertises.length) {
      Alert.alert("Erro", "Please select at least one expertise.");
      return;
    }

    if (!id) {
      Alert.alert("Erro", "Id do vendedor não encontrado.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/save-seller-expertises`,
        {
          id,
          expertises: selectedExpertises,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        navigation.navigate("Step1"); // Navegar para a primeira etapa
      } else {
        Alert.alert("Erro", "Faild to save data.");
      }
    } catch (error) {
      console.error("Erro ao salvar dados:", error.response || error);
      Alert.alert("Erro", "Faild to save data.");
    }
  };

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2); // Avança para a segunda mensagem
    } else if (step === 2) {
      setNotificationModalVisible(true); // Exibe o modal para ativar notificações
    }
  };

  const handleActivateNotifications = async () => {
    await requestNotificationsPermission(); // Solicita permissão para notificações
    setNotificationModalVisible(false); // Fecha o modal
    navigation.navigate("Sellers"); // Navega para a próxima tela
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Choose Expertises</Text>
        <View style={styles.checkboxList}>
          {Object.keys(expertises).map((expertise) => (
            <View key={expertise} style={styles.checkboxContainer}>
              <Checkbox
                status={expertises[expertise] ? "checked" : "unchecked"}
                onPress={() => handleToggle(expertise)}
                color="#6200ee"
              />
              <Text style={styles.checkboxLabel}>{expertise}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {/* Modal para exibir mensagens */}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            {step === 1 ? (
              <Text style={styles.modalText}>Your profile is now ACTIVE.</Text>
            ) : (
              <Text style={styles.modalText}>
                For FREE profile to stay active you must post a review on
                AppStore tomorrow.
              </Text>
            )}
            <Button
              mode="contained"
              onPress={handleContinue}
              style={styles.modalButton}
            >
              Continue
            </Button>
          </Modal>

          <Modal
            visible={notificationModalVisible}
            onDismiss={() => setNotificationModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.modalText}>
              Please enable notifications to stay updated on your profile.
            </Text>
            <Button
              mode="contained"
              onPress={handleActivateNotifications}
              style={styles.modalButton}
            >
              Activate Notifications
            </Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  checkboxList: {
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#6200ee",
  },
});

export default Expertise;
