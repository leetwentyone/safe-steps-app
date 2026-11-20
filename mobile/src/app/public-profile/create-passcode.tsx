import { router, useLocalSearchParams } from 'expo-router';
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

import {
  createPublicProfilePasscode,
} from '@/services/public-profile-passcode';

export default function PublicProfileCreatePasscodeScreen() {
  const { email, displayName, verificationCode } = useLocalSearchParams<{
    email: string;
    displayName?: string;
    verificationCode: string;
  }>();

  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleCreatePasscode() {
    if (!/^\d{6}$/.test(passcode)) {
      Alert.alert(
        'Invalid passcode',
        'Your passcode must contain exactly six digits.',
      );
      return;
    }

    if (passcode !== confirmPasscode) {
      Alert.alert(
        'Passcodes do not match',
        'Please enter the same six-digit passcode in both fields.',
      );
      return;
    }

    if (!email || !verificationCode) {
      Alert.alert(
        'Registration incomplete',
        'Please return to the beginning and try again.',
      );
      return;
    }

    try {
      setSaving(true);

      await createPublicProfilePasscode(passcode);

      router.replace('/public-profile/complete');
      
    } catch (error) {
      Alert.alert(
        'Unable to create passcode',
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Create your passcode</Text>

        <Text style={styles.description}>
          Choose a six-digit passcode to unlock your Safety Profile
          on this device.
        </Text>

        <Text style={styles.label}>Six-digit passcode</Text>

        <TextInput
          style={styles.input}
          value={passcode}
          onChangeText={(value) =>
            setPasscode(value.replace(/\D/g, '').slice(0, 6))
          }
          placeholder="000000"
          placeholderTextColor="#999999"
          keyboardType="number-pad"
          maxLength={6}
          secureTextEntry
          textAlign="center"
        />

        <Text style={styles.label}>Confirm your passcode</Text>

        <TextInput
          style={styles.input}
          value={confirmPasscode}
          onChangeText={(value) =>
            setConfirmPasscode(value.replace(/\D/g, '').slice(0, 6))
          }
          placeholder="000000"
          placeholderTextColor="#999999"
          keyboardType="number-pad"
          maxLength={6}
          secureTextEntry
          textAlign="center"
        />

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Your passcode is stored securely on this device. It is
            not sent to Safe Steps.
          </Text>
        </View>

        <Pressable
          style={[
            styles.primaryButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleCreatePasscode}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? 'Saving...' : 'Create passcode'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
  },
  heading: {
    fontSize: 27,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#333333',
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  input: {
    height: 58,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 8,
    fontSize: 25,
    letterSpacing: 8,
    color: '#000000',
    marginBottom: 24,
  },
  notice: {
    backgroundColor: '#F2F2F2',
    padding: 14,
    borderRadius: 8,
    marginBottom: 26,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#333333',
  },
  primaryButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
  },
});
