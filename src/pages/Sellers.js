import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Card,
  Text,
  Button,
  Modal,
  TextInput,
  Portal,
  Provider,
} from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";

export default function Sellers() {
  console.log("Sellers.js");
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigation = useNavigation();

  const handlePhoneNumberChange = useCallback((text) => {
    setPhoneNumber(text);
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await axios.get(`${API_URL}/psychics-json`);
      setSellers(response.data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const sendVerificationCode = async () => {
    try {
      if (!phoneNumber) {
        Alert.alert("Erro", "Insert a valid phone number.");
        return;
      }

      console.log("Phone", phoneNumber);

      const response = await axios.post(`${API_URL}/api/verify-code`, {
        phonenumber: phoneNumber,
      });

      console.log("Response from backend:", response.data);

      if (response.status === 200) {
        //Alert.alert("Sucesso", response.data.message);

        const verificationCode = response.data.verificationCode;

        console.log("Verification Code from Backend:", verificationCode);

        await AsyncStorage.setItem(
          "verificationCode",
          verificationCode.toString()
        );

        console.log("Stored Code:", verificationCode);

        // Encontre o seller correspondente
        const seller = sellers.find(
          (seller) => seller["PHONE NUMBER"] === phoneNumber
        );

        if (seller) {
          // Armazene o sellerId no AsyncStorage
          await AsyncStorage.setItem("sellerId", seller.id.toString());
          console.log("Stored Seller ID:", seller.id);

          // Navegue para a tela VerifyCode
          navigation.navigate("VerifyCode", {
            phoneNumber,
            expectedCode: verificationCode,
            id: seller.id,
          });
        } else {
          Alert.alert("Erro", "Phone number not found in sellers.");
        }
      } else {
        Alert.alert("Erro", "Not possible to send the verification code.");
      }
    } catch (error) {
      console.error("Error to send notification Code:", error);
      Alert.alert("Erro", "Not possible to send the verification code.");
    }
  };

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setPhoneNumber("");
  };

  const renderSeller = ({ item }) => {
    return (
      <Card style={styles.card}>
        <Card.Cover
          source={{
            uri: item["LINK TO PHOTO"] || "https://via.placeholder.com/150",
          }}
          style={styles.cardImage}
        />
        <Card.Content>
          <Text style={styles.name}>{item.NAME || "Nome não disponível"}</Text>
          <Text style={styles.info}>
            {item.ADDRESS || "Address not available"}
          </Text>
          <Text style={styles.info}>
            Phone: {item["PHONE NUMBER"] || "Phone not available"}
          </Text>
          <Text style={styles.info}>
            Email: {item.EMAIL || "Email not available"}
          </Text>
          <Text style={styles.info}>{`Expertises:${item.expertises}`} </Text>
          <Text style={styles.info}>
            Rating: {item.RATING || "Não available"} (
            {item["NO OF RATINGS"] || 0} ratings)
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={styles.loadingText}>Loading Sellers...</Text>
          </View>
        ) : (
          <FlatList
            data={sellers}
            keyExtractor={(item) =>
              item.id ? item.id.toString() : item["PHONE NUMBER"].toString()
            }
            renderItem={renderSeller}
            contentContainerStyle={styles.listContent}
          />
        )}
        <Button mode="contained" style={styles.fixedButton} onPress={openModal}>
          Verify Phone Number
        </Button>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={closeModal}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Enter Phone Number</Text>
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              style={styles.input}
              keyboardType="phone-pad"
              mode="outlined"
            />
            <Button
              mode="contained"
              onPress={sendVerificationCode}
              style={styles.modalButton}
            >
              Send Verification Code
            </Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  cardImage: {
    height: 150,
    borderRadius: 0,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 4,
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: "#6200ee",
    marginBottom: 8,
  },
  modalCloseButton: {
    backgroundColor: "#ccc",
  },
  fixedButton: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#6200ee",
    borderRadius: 8,
    paddingVertical: 8,
  },
});
