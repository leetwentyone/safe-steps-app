import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useAssistance } from '@/contexts/assistance-context';

export default function TrustedContactsScreen() {
    const [contactName, setContactName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    function handleAddContact() {
        if (!contactName.trim() || !relationship.trim() || !mobileNumber.trim()) {
            Alert.alert(
            'Missing information',
            'Please complete all three fields.',
            );
            return;
        }

        if (!/^[+0-9\s()-]{7,20}$/.test(mobileNumber.trim())) {
            Alert.alert(
            'Invalid mobile number',
            'Please enter a valid mobile number.',
            );
            return;
        }

        if (trustedContacts.length >= 5) {
            Alert.alert(
            'Contact limit reached',
            'You can add a maximum of five trusted contacts.',
            );
            return;
        }

        const added = addTrustedContact({
            name: contactName.trim(),
            relationship: relationship.trim(),
            mobileNumber: mobileNumber.trim(),
        });

        if (!added) {
            Alert.alert('Unable to add contact', 'The five-contact limit has been reached.');
            return;
        }

        setContactName('');
        setRelationship('');
        setMobileNumber('');

        Alert.alert(
            'Contact added',
            'Your contact has been added and is awaiting confirmation. No SMS has been sent in this prototype.',
        );
    }
    const {
        trustedContacts,
        addTrustedContact,
        removeTrustedContact,
        updateTrustedContactStatus,
    } = useAssistance();
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>
                Trusted Contacts
            </Text>

            <Text style={styles.description}>
                Add up to five people you trust who can be
                notified if you need assistance from Safe Steps.
            </Text>

            <View style={styles.formCard}>
                <Text style={styles.formHeading}>Add a contact</Text>

                <Text style={styles.inputLabel}>CONTACT NAME</Text>
                <TextInput
                style={styles.input}
                placeholder="e.g. Jane Smith"
                value={contactName}
                onChangeText={setContactName}
                />

                <Text style={styles.inputLabel}>RELATIONSHIP</Text>
                <TextInput
                style={styles.input}
                placeholder="e.g. Mum, Brother, Friend"
                value={relationship}
                onChangeText={setRelationship}
                />

                <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
                <TextInput
                style={styles.input}
                placeholder="e.g. 07700 900000"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                />
                <Pressable
                    style={styles.addButton}
                    onPress={handleAddContact}
                    >
                    <Text style={styles.addButtonText}>
                        ADD TRUSTED CONTACT
                    </Text>
                </Pressable>
            </View>
            <View style={styles.contactsSection}>
            <Text style={styles.formHeading}>
                Your trusted contacts ({trustedContacts.length}/5)
            </Text>

            {trustedContacts.length === 0 ? (
                <Text style={styles.emptyText}>
                You haven't added any trusted contacts yet.
                </Text>
            ) : (
                trustedContacts.map((contact) => (
                <View key={contact.id} style={styles.contactCard}>
                    <Text style={styles.contactName}>
                    {contact.name}
                    </Text>

                    <Text style={styles.contactDetails}>
                    {contact.relationship} · {contact.mobileNumber}
                    </Text>

                    <Text style={styles.contactStatus}>
                    {contact.status === 'pending'
                        ? 'AWAITING CONFIRMATION'
                        : contact.status === 'confirmed'
                        ? 'CONFIRMED'
                        : 'DECLINED'}
                    </Text>

                    {contact.status === 'confirmed' && (
                    <Text style={styles.eligibleStatus}>
                        ✓ ELIGIBLE FOR SAFE STEPS NOTIFICATIONS
                    </Text>
                    )}

                    {contact.status === 'pending' && (
                        <View style={styles.confirmationActions}>
                            <Pressable
                            style={styles.confirmButton}
                            onPress={() =>
                                updateTrustedContactStatus(contact.id, 'confirmed')
                            }
                            >
                            <Text style={styles.confirmButtonText}>
                                CONFIRM
                            </Text>
                            </Pressable>

                            <Pressable
                            style={styles.declineButton}
                            onPress={() =>
                                updateTrustedContactStatus(contact.id, 'declined')
                            }
                            >
                            <Text style={styles.declineButtonText}>
                                DECLINE
                            </Text>
                            </Pressable>
                        </View>
                    )}

                    <Pressable
                    style={styles.removeButton}
                    onPress={() =>
                        Alert.alert(
                        'Remove contact',
                        `Are you sure you want to remove ${contact.name}?`,
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                            text: 'Remove',
                            style: 'destructive',
                            onPress: () => removeTrustedContact(contact.id),
                            },
                        ],
                        )
                    }
                    >
                    <Text style={styles.removeButtonText}>
                        REMOVE CONTACT
                    </Text>
                    </Pressable>
                </View>
                ))
            )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    container: {
        flexGrow: 1,
        padding: 24,
    },
    heading: {
        fontSize: 26,
        fontWeight: '700',
        color: '#173B57',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 23,
        color: '#526575',
    },
    formCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 18,
        marginTop: 28,
    },

    formHeading: {
        fontSize: 18,
        fontWeight: '700',
        color: '#173B57',
     marginBottom: 20,
    },

    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#526575',
        marginBottom: 8,
        marginTop: 14,
        letterSpacing: 0.5,
    },

    input: {
        width: '100%',
        backgroundColor: '#F5F7FA',
        borderWidth: 1,
        borderColor: '#DCE3E9',
        borderRadius: 9,
        padding: 13,
        fontSize: 15,
        color: '#173B57',
    },
    addButton: {
        backgroundColor: '#173B57',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
     },

    addButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    contactsSection: {
        marginTop: 30,
        marginBottom: 30,
    },

    emptyText: {
        color: '#526575',
        fontSize: 14,
        lineHeight: 21,
        marginTop: 8,
    },

    contactCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#DCE3E9',
    },

    contactName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#173B57',
    },

    contactDetails: {
        fontSize: 13,
        color: '#526575',
        marginTop: 5,
    },

    contactStatus: {
        fontSize: 11,
        fontWeight: '800',
        color: '#B7791F',
        marginTop: 14,
        letterSpacing: 0.4,
    },

    eligibleStatus: {
        color: '#237A45',
        fontSize: 11,
        fontWeight: '800',
        marginTop: 8,
        letterSpacing: 0.3,
    },

    removeButton: {
        alignSelf: 'flex-start',
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 7,
        backgroundColor: '#FCE8E8',
    },

    removeButtonText: {
        color: '#B52B2B',
        fontSize: 11,
        fontWeight: '800',
    },
    confirmationActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
    },

    confirmButton: {
        flex: 1,
        backgroundColor: '#E2F3E9',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },

    confirmButtonText: {
        color: '#237A45',
        fontSize: 12,
        fontWeight: '800',
    },

    declineButton: {
        flex: 1,
        backgroundColor: '#FCE8E8',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },

    declineButtonText: {
        color: '#B52B2B',
        fontSize: 12,
        fontWeight: '800',
    },
});