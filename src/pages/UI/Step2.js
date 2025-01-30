import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const Step2 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        For FREE profile to stay active you must post a review on AppStore
        tomorrow.
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("NotificationsScreen")}
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

export default Step2;
