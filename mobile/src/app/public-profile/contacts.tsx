import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { apiRequest } from '@/services/api';
import { getPublicDeviceCredentials } from '@/services/public-profile-storage';

type EmergencyContact = {
  id: number;
  relationship: string;
  phone_number: string;
  sms_consent_status: string;
  sms_consent_at: string | null;
};

type ContactsResponse = {
  success: boolean;
  count: number;
  contacts: EmergencyContact[];
};

export default function PublicProfileContactsScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invitationMessages, setInvitationMessages] = useState<
    Record<number, string>
  >({});
  const [preparingInvitation, setPreparingInvitation] = useState<
    Record<number, boolean>
  >({});

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const credentials = await getPublicDeviceCredentials();

      if (!credentials) {
        throw new Error(
          'Your Safety Profile could not be unlocked. Please return and unlock it again.'
        );
      }

      const response = await apiRequest<ContactsResponse>(
        '/public/contacts',
        {
          token: credentials.deviceToken,
        }
      );

      setContacts(response.contacts ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your emergency contacts.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts])
  );

  function confirmDeleteContact(contact: EmergencyContact) {
    Alert.alert(
      'Remove emergency contact',
      `Are you sure you want to remove ${contact.relationship} (${contact.phone_number}) from your Safety Profile?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteContact(contact.id),
        },
      ]
    );
  }

  async function deleteContact(contactId: number) {
    try {
      const credentials = await getPublicDeviceCredentials();

      if (!credentials) {
        throw new Error(
          'Your Safety Profile could not be unlocked. Please return and unlock it again.'
        );
      }

      await apiRequest<{ success: boolean; message?: string }>(
        `/public/contacts/${contactId}`,
        {
          method: 'DELETE',
          token: credentials.deviceToken,
        }
      );

      await loadContacts();

      Alert.alert(
        'Contact removed',
        'The emergency contact has been removed from your Safety Profile.'
      );
    } catch (err) {
      Alert.alert(
        'Unable to remove contact',
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    }
  }

  function getConsentLabel(status: string) {
    switch (status) {
      case 'confirmed':
        return 'SMS consent confirmed';

      case 'declined':
        return 'SMS consent declined';

      case 'withdrawn':
        return 'SMS consent withdrawn';

      case 'pending':
      default:
        return 'SMS consent pending';
    }
  }

  function getConsentStyle(status: string) {
    switch (status) {
      case 'confirmed':
        return styles.consentConfirmed;

      case 'declined':
        return styles.consentDeclined;

      case 'withdrawn':
        return styles.consentWithdrawn;

      case 'pending':
      default:
        return styles.consentPending;
    }
  }

  function canPrepareConsentInvitation(status: string) {
    return status === 'pending';
  }

  async function prepareConsentInvitation(contact: EmergencyContact) {
    setPreparingInvitation((previous) => ({
      ...previous,
      [contact.id]: true,
    }));

    setInvitationMessages((previous) => ({
      ...previous,
      [contact.id]: '',
    }));

    try {
      const credentials = await getPublicDeviceCredentials();

      if (!credentials) {
        throw new Error(
          'Please return to your Safety Profile and unlock it again.'
        );
      }

      const response = await apiRequest<{
        success: boolean;
        message: string;
        expires_at?: string;
      }>(
        `/public/contacts/${contact.id}/consent-invitation`,
        {
          method: 'POST',
          token: credentials.deviceToken,
        }
      );

      setInvitationMessages((previous) => ({
        ...previous,
        [contact.id]: response.message,
      }));
    } catch (error) {
      setInvitationMessages((previous) => ({
        ...previous,
        [contact.id]:
          error instanceof Error
            ? error.message
            : 'We couldn’t connect to Safe Steps just now. Please check your internet connection and try again shortly.',
      }));
    } finally {
      setPreparingInvitation((previous) => ({
        ...previous,
        [contact.id]: false,
      }));
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>Emergency Contacts</Text>

      <Text style={styles.description}>
        Add up to five people who Safe Steps may contact when assistance is
        needed. Each contact must separately agree to receive SMS messages
        before they can be included in timeout notifications.
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryCount}>
          {contacts.length} of 5
        </Text>
        <Text style={styles.summaryLabel}>
          Emergency contacts added
        </Text>
      </View>

      {loading ? (
        <View style={styles.messageCard}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.messageText}>
            Loading your emergency contacts...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.messageCard}>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadContacts}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            No contacts added yet
          </Text>
          <Text style={styles.emptyDescription}>
            Your emergency contacts will appear here once you add them.
          </Text>
        </View>
      ) : (
        <View style={styles.contactList}>
          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <Text style={styles.contactRelationship}>
                {contact.relationship}
              </Text>

              <Text style={styles.contactPhone}>
                {contact.phone_number}
              </Text>

              <Text
                style={[
                  styles.consentStatus,
                  getConsentStyle(contact.sms_consent_status),
                ]}
              >
                {getConsentLabel(contact.sms_consent_status)}
              </Text>

              {canPrepareConsentInvitation(contact.sms_consent_status) && (
                <Pressable
                  style={[
                    styles.invitationButton,
                    preparingInvitation[contact.id] && styles.disabledButton,
                  ]}
                  onPress={() => prepareConsentInvitation(contact)}
                  disabled={!!preparingInvitation[contact.id]}
                >
                  <Text style={styles.invitationButtonText}>
                    {preparingInvitation[contact.id]
                      ? 'Preparing...'
                      : 'Prepare Consent Invitation'}
                  </Text>
                </Pressable>
              )}

              {invitationMessages[contact.id] ? (
                <Text style={styles.invitationMessage}>
                  {invitationMessages[contact.id]}
                </Text>
              ) : null}
      
              <Pressable
                style={styles.removeButton}
                onPress={() => confirmDeleteContact(contact)}
              >
                <Text style={styles.removeButtonText}>
                  Remove Contact
                </Text>
              </Pressable>

            </View>
          ))}
        </View>
      )}

      <Pressable
        style={[
          styles.primaryButton,
          contacts.length >= 5 && styles.disabledButton,
        ]}
        disabled={contacts.length >= 5 || loading}
        onPress={() => router.push('/public-profile/add-contact')}
      >
        <Text style={styles.primaryButtonText}>
          {contacts.length >= 5
            ? 'Maximum Contacts Reached'
            : 'Add Emergency Contact'}
        </Text>
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>
          Return to Safety Profile
        </Text>
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
    marginBottom: 14,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 26,
  },
  summaryCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryCount: {
    fontSize: 30,
    fontWeight: '700',
    color: '#000000',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#333333',
    marginTop: 5,
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#333333',
    textAlign: 'center',
  },
  messageCard: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  messageText: {
    fontSize: 14,
    color: '#333333',
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#333333',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  contactList: {
    marginBottom: 24,
  },
  contactCard: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
  },
  contactRelationship: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  contactPhone: {
    fontSize: 15,
    color: '#333333',
    marginBottom: 12,
  },
  consentStatus: {
    fontSize: 13,
    fontWeight: '400',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  consentConfirmed: {
    color: '#FFFFFF',
    backgroundColor: '#2b9348',
    fontWeight: '400',
  },
  consentPending: {
    color: '#FFFFFF',
    backgroundColor: '#000000',
    fontWeight: '400',
  },
  consentDeclined: {
    color: '#FFFFFF',
    backgroundColor: '#d00000',
    fontWeight: '400',
  },
  consentWithdrawn: {
    color: '#FFFFFF',
    backgroundColor: '#d00000',
    fontWeight: '400',
  },
  invitationButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
  },
  invitationButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
  },
  invitationMessage: {
    fontSize: 13,
    lineHeight: 19,
    color: '#333333',
    marginTop: 10,
  },
  removeButton: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666666',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
  },
});