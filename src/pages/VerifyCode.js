import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VerifyCode = ({ route, navigation }) => {
  const { phoneNumber } = route.params; // O número de telefone passado pela navegação
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]); // Array para armazenar cada dígito
  const [storedCode, setStoredCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Para verificar o estado de carregamento

  // Referências para os inputs
  const inputRefs = useRef([...Array(4)].map(() => React.createRef()));

  // Carregar o código de verificação do AsyncStorage assim que a página for carregada
  useEffect(() => {
    const fetchVerificationCode = async () => {
      const code = await AsyncStorage.getItem("verificationCode");
      console.log("Stored Code:", code); // Exibe o código armazenado no console
      if (code) {
        setStoredCode(code); // Armazena o código no estado local
      }
      setIsLoading(false); // Fim do carregamento
    };

    fetchVerificationCode();
  }, []);

  // Função para atualizar o código de verificação
  const handleCodeChange = (text, index) => {
    const newCode = [...verificationCode];
    newCode[index] = text;

    setVerificationCode(newCode);

    // Mover o foco para o próximo campo se um dígito for inserido
    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    // Verificar automaticamente o código quando todos os dígitos forem inseridos
    if (index === 3 && newCode.every((digit) => digit !== "")) {
      handleVerifyCode(newCode.join(""));
    }
  };

  // Função para verificar o código
  const handleVerifyCode = async (code) => {
    if (isLoading) {
      Alert.alert("Aguarde", "Loading...");
      return;
    }

    console.log("Código esperado:", storedCode); // Exibe o código correto armazenado
    console.log("Código inserido:", code); // Exibe o código inserido

    // Verificação do código inserido
    if (code === storedCode) {
      navigation.navigate("Email"); // Navegar para a próxima página
    } else {
      // Código errado
      Alert.alert("Erro", "Invalid verification code.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Code</Text>
      <Text style={styles.subtitle}>Sent to: {phoneNumber}</Text>
      <View style={styles.codeContainer}>
        {[...Array(4)].map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.codeInput}
            keyboardType="numeric"
            maxLength={1}
            value={verificationCode[index]}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace" && index > 0) {
                inputRefs.current[index - 1].focus(); // Mover o foco para o campo anterior ao apagar
              }
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
  },
  verifyButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
  },
});

export default VerifyCode;
