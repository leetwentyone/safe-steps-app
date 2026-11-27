import { useAssistance } from '@/contexts/assistance-context';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { apiRequest } from '@/services/api';
import { getPublicDeviceCredentials } from '@/services/public-profile-storage';

type ContactsResponse = {
  success: boolean;
  count: number;
  contacts: {
    id: number;
    relationship: string;
    phone_number: string;
    sms_consent_status: string;
    sms_consent_at: string | null;
  }[];
};

export default function PublicProfileDashboardScreen() {
  const { lockPublicProfile } = useAssistance();
  const [contactCount, setContactCount] = useState(0);
  const [contactsLoading, setContactsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadContactCount() {
        try {
          const credentials = await getPublicDeviceCredentials();

          if (!credentials) {
            return;
          }

          const response = await apiRequest<ContactsResponse>(
            '/public/contacts',
            {
              token: credentials.deviceToken,
            }
          );

          if (isActive) {
            setContactCount(response.count);
          }
        } catch (error) {
          console.error('Unable to load emergency contact count:', error);
        } finally {
          if (isActive) {
            setContactsLoading(false);
          }
        }
      }

      loadContactCount();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.heading}>Your Safety Profile</Text>
        <Text style={styles.description}>
          Your private space for managing the emergency contacts you want
          Safe Steps to have available if you need assistance.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Emergency Contacts</Text>
        <Text style={styles.contactCount}>
          {contactsLoading ? 'Loading...' : `${contactCount} of 5`}
        </Text>
        <Text style={styles.cardDescription}>
          {contactCount === 0
            ? "You haven't added any emergency contacts yet. You can save up to five trusted people who may be contacted when needed."
            : `You have saved ${contactCount} of your five emergency contacts. You can manage or update these whenever you need to.`}
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/public-profile/contacts')}
        >
          <Text style={styles.primaryButtonText}>
            Manage Emergency Contacts
          </Text>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Your privacy</Text>
        <Text style={styles.infoDescription}>
          Your Safety Profile is optional. You can still request help through
          Safe Steps without creating or accessing a profile.
        </Text>
      </View>

      <Pressable
        style={styles.lockButton}
        onPress={() => {
          lockPublicProfile();
          router.replace('/(tabs)');
        }}
      >
        <Text style={styles.lockButtonText}>Lock Safety Profile</Text>
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
    paddingTop: 48,
  },
  header: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#333333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  contactCount: {
    fontSize: 30,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#333333',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#333333',
  },
  lockButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 'auto',
  },
  lockButtonText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
  },
});