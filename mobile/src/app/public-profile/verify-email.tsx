import { apiRequest } from '@/services/api';
import { savePublicDeviceCredentials } from '@/services/public-profile-storage';
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

export default function PublicProfileVerifyEmailScreen() {
  const { email, displayName } = useLocalSearchParams<{
    email: string;
    displayName?: string;
  }>();

  const [verificationCode, setVerificationCode] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    if (!/^\d{6}$/.test(verificationCode)) {
      Alert.alert(
        'Invalid code',
        'Please enter the six-digit verification code.',
      );
      return;
    }

    if (!email) {
      Alert.alert(
        'Missing email',
        'Please return to registration and try again.',
      );
      return;
    }

    try {
      setSaving(true);

      const response = await apiRequest<{
        success: boolean;
        message?: string;
        profile: {
          id: number;
          email: string;
          display_name: string;
        };
        device: {
          id: number;
          name: string;
          token: string;
        };
        verified_at: string;
      }>('/public/verify-email', {
        method: 'POST',
        body: {
          email,
          verification_code: verificationCode,
          device_name: 'Safe Steps device',
        },
      });

      if (!response.success) {
        throw new Error(
          response.message ?? 'Email verification failed.',
        );
      }

      await savePublicDeviceCredentials(
        response.profile.id,
        response.device.token,
      );

      router.push({
        pathname: '/public-profile/create-passcode',
        params: {
          email: response.profile.email,
          displayName: response.profile.display_name,
          verificationCode,
        },
      });
    } catch (error) {
      Alert.alert(
        'Verification failed',
        error instanceof Error
          ? error.message
          : 'Unable to verify your email. Please try again.',
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
        <Text style={styles.heading}>Verify your email</Text>

        <Text style={styles.description}>
          We sent a six-digit verification code to:
        </Text>

        <Text style={styles.email}>{email}</Text>

        <Text style={styles.description}>
          Enter the code below to verify your email address and continue
          setting up your Safety Profile.
        </Text>

        <Text style={styles.label}>Verification code</Text>

        <TextInput
          style={styles.input}
          value={verificationCode}
          onChangeText={(value) =>
            setVerificationCode(value.replace(/\D/g, '').slice(0, 6))
          }
          placeholder="000000"
          placeholderTextColor="#999999"
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
          autoComplete="one-time-code"
        />

        <Pressable
          style={[
            styles.primaryButton,
            saving && { opacity: 0.5 },
          ]}
          onPress={handleContinue}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? 'Verifying email...' : 'Verify email'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Your verification code expires after 10 minutes.
          </Text>
        </View>
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
    marginBottom: 18,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#333333',
    marginBottom: 14,
  },
  email: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 22,
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
    fontWeight: '600',
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
  notice: {
    backgroundColor: '#F2F2F2',
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#333333',
    textAlign: 'center',
  },
});
