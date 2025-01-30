import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView, Image } from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Checkbox,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

export default function Profile({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    address: "",
    expertises: [],
    photoUrl: "",
  });
  const [allExpertises, setAllExpertises] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("sellerId");
        if (id) {
          setUserId(id);
          console.log("User ID:", id);
          await fetchProfile(id); // Chama fetchProfile após obter userId
        } else {
          Alert.alert("Error", "User ID not found.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        Alert.alert("Error", "Failed to fetch user ID.");
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const fetchProfile = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/psychics/${id}`);
      const {
        NAME: name,
        EMAIL: email,
        ADDRESS: address,
        expertises,
        photoUrl,
      } = response.data;

      setProfileData({
        name: name || "",
        email: email || "",
        address: address || "",
        expertises: expertises || [],
        photoUrl: photoUrl || "",
      });

      // Buscar especialidades após carregar o perfil
      await fetchExpertises(id);
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Could not fetch profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpertises = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/psychics/${id}/expertises`);
      setAllExpertises(response.data || []);
    } catch (error) {
      console.error("Error fetching expertises:", error);
      Alert.alert("Error", "Could not fetch expertises. Please try again.");
    }
  };

  const updateProfile = async () => {
    try {
      if (!profileData.name || !profileData.email || !profileData.address) {
        Alert.alert("Error", "All fields are required.");
        return;
      }

      await axios.put(`${API_URL}/psychics/${userId}`, {
        id: userId,
        name: profileData.name,
        email: profileData.email,
        address: profileData.address,
        expertises: profileData.expertises,
      });

      Alert.alert("Success", "Profile updated successfully.");
      navigation.navigate("Sellers");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleCheckboxChange = (expertise) => {
    setProfileData((prevState) => {
      const newExpertises = prevState.expertises.includes(expertise)
        ? prevState.expertises.filter((item) => item !== expertise)
        : [...prevState.expertises, expertise];

      return { ...prevState, expertises: newExpertises };
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{profileData.name} Profile</Text>

      {profileData.photoUrl ? (
        <Image
          source={{ uri: `${API_URL}${profileData.photoUrl}` }}
          //http://192.168.1.73:3000/uploads/1738196489306.jpg
          style={styles.profileImage}
        />
      ) : (
        <Text style={styles.noImageText}>No profile picture available</Text>
      )}

      <TextInput
        label="Name"
        value={profileData.name}
        onChangeText={(text) =>
          setProfileData((prevState) => ({ ...prevState, name: text }))
        }
        style={styles.input}
      />
      <TextInput
        label="Address"
        value={profileData.address}
        onChangeText={(text) =>
          setProfileData((prevState) => ({ ...prevState, address: text }))
        }
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={profileData.email}
        onChangeText={(text) =>
          setProfileData((prevState) => ({ ...prevState, email: text }))
        }
        style={styles.input}
      />

      <Text style={styles.label}>Expertises:</Text>
      <View style={styles.checkboxContainer}>
        {allExpertises.length > 0 ? (
          allExpertises.map((expertise, index) => (
            <View key={index} style={styles.checkboxItem}>
              <Checkbox
                status={
                  profileData.expertises.includes(expertise)
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => handleCheckboxChange(expertise)}
              />
              <Text style={styles.checkboxLabel}>{expertise}</Text>
            </View>
          ))
        ) : (
          <Text>No expertises available</Text>
        )}
      </View>

      <Button mode="contained" onPress={updateProfile} style={styles.button}>
        Save Changes
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: { marginBottom: 12 },
  button: { backgroundColor: "#6200ee", marginTop: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: { marginTop: 12, fontSize: 16, color: "#555" },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 12,
    alignSelf: "center",
  },
  noImageText: { textAlign: "center", marginBottom: 12 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  checkboxContainer: { flexDirection: "row", flexWrap: "wrap" },
  checkboxItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkboxLabel: { fontSize: 16, marginLeft: 8 },
});
