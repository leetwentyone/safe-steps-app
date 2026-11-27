import { useAssistance } from '@/contexts/assistance-context';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  verifyPublicProfilePasscode,
} from '@/services/public-profile-passcode';

export default function PublicProfileUnlockScreen() {
  const { unlockPublicProfile } = useAssistance();
  const [passcode, setPasscode] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  async function handleUnlock() {
    if (!/^\d{6}$/.test(passcode)) {
      Alert.alert(
        'Invalid passcode',
        'Please enter your six-digit passcode.',
      );
      return;
    }

    try {
      setUnlocking(true);

      const isValid = await verifyPublicProfilePasscode(passcode);

      if (!isValid) {
        Alert.alert(
          'Incorrect passcode',
          'That passcode is incorrect. Please try again.',
        );
        setPasscode('');
        return;
      }

      unlockPublicProfile();

      router.replace('/public-profile/dashboard');
      
    } catch (error) {
      Alert.alert(
        'Unable to unlock',
        error instanceof Error
          ? error.message
          : 'Unable to unlock your Safety Profile. Please try again.',
      );
    } finally {
      setUnlocking(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.lockIcon}>
        <Text style={styles.lockEmoji}>🔒</Text>
      </View>

      <Text style={styles.heading}>
        Access Your Safety Profile
      </Text>

      <Text style={styles.description}>
        Enter your six-digit passcode to access your saved
        Safety Profile on this device.
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
        autoFocus
      />

      <Pressable
        style={[
          styles.primaryButton,
          unlocking && styles.disabledButton,
        ]}
        onPress={handleUnlock}
        disabled={unlocking}
      >
        <Text style={styles.primaryButtonText}>
          {unlocking ? 'Unlocking...' : 'Unlock Safety Profile'}
        </Text>
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={unlocking}
      >
        <Text style={styles.backButtonText}>
          Return to Safe Steps
        </Text>
      </Pressable>

      <Text style={styles.footer}>
        If you have forgotten your passcode, account recovery
        will be available in a future update.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  lockIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  lockEmoji: {
    fontSize: 32,
  },
  heading: {
    fontSize: 27,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 32,
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
    marginBottom: 26,
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
  footer: {
    fontSize: 12,
    lineHeight: 18,
    color: '#555555',
    textAlign: 'center',
    marginTop: 28,
  },
});