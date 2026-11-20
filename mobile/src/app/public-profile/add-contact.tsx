import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { apiRequest } from '@/services/api';
import { getPublicDeviceCredentials } from '@/services/public-profile-storage';

export default function AddPublicProfileContactScreen() {
  const [relationship, setRelationship] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!relationship.trim()) {
      Alert.alert(
        'Relationship required',
        'Please enter the contact relationship, such as Dad or Friend.',
      );
      return;
    }

    const cleanedPhoneNumber = phoneNumber.trim();

    if (
      !/^\+?[0-9\s().-]{7,25}$/.test(cleanedPhoneNumber) ||
      (cleanedPhoneNumber.match(/[0-9]/g) ?? []).length < 7
    ) {
      Alert.alert(
        'Invalid phone number',
        'Please enter a valid mobile phone number.',
      );
      return;
    }

    if (saving) return;

    setSaving(true);

    try {
      const credentials = await getPublicDeviceCredentials();

      if (!credentials) {
        throw new Error(
          'Your device authentication details could not be found. Please unlock your Safety Profile and try again.',
        );
      }

      await apiRequest<{
        success: boolean;
        message?: string;
      }>('/public/contacts', {
        method: 'POST',
        token: credentials.deviceToken,
        body: {
          relationship: relationship.trim(),
          phone_number: cleanedPhoneNumber,
        },
      });

      Alert.alert(
        'Contact saved',
        'Your emergency contact has been saved securely. SMS consent is currently pending.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Unable to save contact',
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Add Emergency Contact</Text>

      <Text style={styles.description}>
        Enter the relationship and mobile number for someone you trust.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Relationship</Text>
        <TextInput
          style={styles.input}
          value={relationship}
          onChangeText={setRelationship}
          placeholder="e.g. Dad, Mum, Partner or Friend"
          placeholderTextColor="#999999"
          maxLength={50}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Mobile phone number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="e.g. 07123 456789"
          placeholderTextColor="#999999"
          keyboardType="phone-pad"
          maxLength={25}
        />
      </View>

      <View style={styles.consentCard}>
        <Text style={styles.consentTitle}>SMS consent</Text>
        <Text style={styles.consentDescription}>
          Before this contact can receive SMS notifications, they must
          explicitly agree to receive them. We will record their consent
          separately when we implement the confirmation process.
        </Text>
        <Text style={styles.pendingStatus}>Consent status: Pending</Text>
      </View>

      <Pressable
        style={[
          styles.primaryButton,
          saving && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>
            Save Emergency Contact
          </Text>
        )}
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={saving}
      >
        <Text style={styles.backButtonText}>Cancel</Text>
      </Pressable>
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
    padding: 24,
    paddingTop: 40,
  },
  heading: {
    fontSize: 27,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 30,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#000000',
  },
  consentCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 18,
    marginBottom: 28,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  consentDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#333333',
    marginBottom: 12,
  },
  pendingStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  primaryButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
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