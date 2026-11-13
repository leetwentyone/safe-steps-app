import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const NAVY = '#173B57';
const BLUE = '#245B83';
const MUTED = '#526575';
const BACKGROUND = '#F5F7FA';

export default function StaffLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Missing information',
        'Please enter your email address and password.',
      );
      return;
    }

    Alert.alert(
      'Login not connected',
      'Staff authentication will be connected when we build the secure backend.',
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoSymbol}>S</Text>
          </View>

          <Text style={styles.heading}>Staff Login</Text>

          <Text style={styles.description}>
            Sign in to access your Safe Steps volunteer or organiser account.
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.formHeading}>
              Welcome back
            </Text>

            <Text style={styles.inputLabel}>
              EMAIL ADDRESS
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.inputLabel}>
              PASSWORD
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Pressable
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>
                SIGN IN
              </Text>
            </Pressable>

            <Text style={styles.helpText}>
              Volunteer access is provided by invitation from a Safe Steps organiser.
            </Text>
          </View>

          <Text style={styles.footer}>
            Safe Steps · Helping people get home safely
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  keyboard: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoSymbol: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: MUTED,
    textAlign: 'center',
    marginBottom: 26,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DCE3E9',
  },
  formHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: MUTED,
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    backgroundColor: BACKGROUND,
    borderWidth: 1,
    borderColor: '#DCE3E9',
    borderRadius: 9,
    padding: 14,
    fontSize: 15,
    color: NAVY,
  },
  loginButton: {
    backgroundColor: BLUE,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 26,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  helpText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 18,
  },
  footer: {
    color: MUTED,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 28,
  },
});
