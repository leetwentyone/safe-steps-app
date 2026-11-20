import { apiRequest } from '@/services/api';
import { router } from 'expo-router';
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

export default function PublicProfileRegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    const normalisedEmail = email.trim().toLowerCase();
    const normalisedName = displayName.trim();

    if (!normalisedEmail) {
      Alert.alert('Email required', 'Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalisedEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    try {
      setSaving(true);

      const response = await apiRequest<{
        success: boolean;
        message?: string;
      }>('/public/register', {
        method: 'POST',
        body: {
          email: normalisedEmail,
          display_name: normalisedName,
        },
      });

      if (!response.success) {
        throw new Error(
          response.message ?? 'Registration could not be completed.'
        );
      }

      router.push({
        pathname: '/public-profile/verify-email',
        params: {
          email: normalisedEmail,
          displayName: normalisedName,
        },
      });
    } catch (error) {
      Alert.alert(
        'Registration failed',
        error instanceof Error
          ? error.message
          : 'Unable to register. Please try again.'
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
        <Text style={styles.heading}>Create your Safety Profile</Text>

        <Text style={styles.intro}>
          Your Safety Profile lets you save up to five emergency contacts
          so they are available if you ever need assistance.
        </Text>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Completely optional</Text>
          <Text style={styles.noticeText}>
            You do not need an account or profile to request help.
            You can use Safe Steps at any time without registering.
          </Text>
        </View>

        <Text style={styles.label}>Your name (optional)</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter your name"
          placeholderTextColor="#777"
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={100}
        />

        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email address"
          placeholderTextColor="#777"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />

        <Text style={styles.privacy}>
          We use your email for verification and account recovery only.
          We will not send marketing emails or newsletters.
        </Text>

        <Pressable
          style={[
            styles.primaryButton,
            saving && { opacity: 0.5 },
          ]}
          onPress={handleContinue}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? 'Sending verification code...' : 'Continue to email verification'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>

        <Text style={styles.footer}>
          Safe Steps is not an emergency service. If you are in immediate
          danger, call 999.
        </Text>
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
    marginBottom: 14,
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 24,
  },
  notice: {
    backgroundColor: '#F2F2F2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 28,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#333333',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#000000',
    marginBottom: 22,
  },
  privacy: {
    fontSize: 13,
    lineHeight: 20,
    color: '#333333',
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
  footer: {
    fontSize: 12,
    lineHeight: 18,
    color: '#555555',
    textAlign: 'center',
    marginTop: 28,
  },
});