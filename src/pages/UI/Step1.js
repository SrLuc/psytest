import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const Step1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your profile is now ACTIVE.</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Step2")}
        style={styles.button}
      >
        Continue
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

export default Step1;
