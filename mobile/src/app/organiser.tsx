import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAssistance } from '@/contexts/assistance-context';

export default function OrganiserScreen() {
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');

  function handleReassignPress() {
    const selectedVolunteer = volunteers.find(
      (volunteer) => volunteer.id === selectedVolunteerId,
    );

    if (!selectedVolunteer) {
      Alert.alert(
        'Select a volunteer',
        'Please select an available volunteer first.',
      );
      return;
    }

    if (selectedVolunteer.id === request?.assignedVolunteerId) {
      Alert.alert(
        'Already assigned',
        'This volunteer is already assigned to this request.',
      );
      return;
    }

    Alert.alert(
      'Confirm reassignment',
      `Are you sure you want to reassign this request to ${selectedVolunteer.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reassign',
          onPress: () => {
            reassignRequest(selectedVolunteer.id);
            setSelectedVolunteerId('');
          },
        },
      ],
    );
  }

  const {
    request,
    timeoutEscalation,
    serviceEnabled,
    setServiceEnabled,
    volunteers,
    reassignRequest,
    requestTimeoutMinutes,
    setRequestTimeoutMinutes,
    trustedContacts,
  } = useAssistance();

  const volunteersOnDuty = volunteers.filter(
    (volunteer) => volunteer.isAvailable,
  ).length;

  const isWaiting = request?.status === 'waiting';

  const isActive =
    request?.status === 'accepted' ||
    request?.status === 'contacted';

  const isCompleted = request?.status === 'completed';

  const isCancelled = request?.status === 'cancelled';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>SAFE STEPS</Text>
          <Text style={styles.subtitle}>ORGANISER DASHBOARD</Text>
        </View>

        <View style={styles.serviceCard}>
          <Text style={styles.sectionLabel}>MASTER SERVICE CONTROL</Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                serviceEnabled ? styles.greenDot : styles.redDot,
              ]}
            />
            <Text
              style={[
                styles.serviceStatus,
                serviceEnabled ? styles.greenText : styles.redText,
              ]}
            >
              {serviceEnabled ? 'SERVICE IS ON' : 'SERVICE IS OFF'}
            </Text>
          </View>

          <Text style={styles.description}>
            {serviceEnabled
              ? 'The demonstration service is switched on.'
              : 'The demonstration service is currently switched off.'}
          </Text>

          <Pressable
            style={[
              styles.serviceButton,
              serviceEnabled ? styles.turnOffButton : styles.turnOnButton,
            ]}
            onPress={() => setServiceEnabled(!serviceEnabled)}
          >
            <Text style={styles.serviceButtonText}>
              {serviceEnabled ? 'TURN SERVICE OFF' : 'TURN SERVICE ON'}
            </Text>
          </Pressable>

          <Text style={styles.demoNote}>
            Demonstration control only. This does not yet affect the Public
            or Volunteer screens.
          </Text>
        </View>

        <View style={styles.timeoutCard}>
          <Text style={styles.sectionLabel}>REQUEST TIMEOUT</Text>

          <Text style={styles.description}>
            Choose how long a request can wait for a volunteer before
            the organiser and the user&apos;s trusted contacts are notified.
          </Text>

          <Text style={styles.timeoutValue}>
            {requestTimeoutMinutes} {requestTimeoutMinutes === 1 ? 'minute' : 'minutes'}
          </Text>

          <View style={styles.timeoutOptions}>
            {[1, 2, 3, 4, 5].map((minutes) => (
              <Pressable
                key={minutes}
                style={[
                  styles.timeoutOption,
                  requestTimeoutMinutes === minutes &&
                    styles.selectedTimeoutOption,
                ]}
                onPress={() => setRequestTimeoutMinutes(minutes)}
              >
                <Text
                  style={[
                    styles.timeoutOptionText,
                    requestTimeoutMinutes === minutes &&
                      styles.selectedTimeoutOptionText,
                  ]}
                >
                  {minutes}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.demoNote}>
            Demonstration setting. Notifications are not yet sent.
          </Text>
        </View>

        <Text style={styles.sectionHeading}>SERVICE OVERVIEW</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.metricValue}>
              {volunteersOnDuty}
            </Text>
            <Text style={styles.metricLabel}>Volunteers on duty</Text>
            <Text style={styles.summaryNote}>
              {volunteersOnDuty === 1
                ? '1 volunteer is available'
                : `${volunteersOnDuty} volunteers are available`}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {isWaiting ? '1' : '0'}
            </Text>
            <Text style={styles.summaryLabel}>Incoming requests</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {isActive ? '1' : '0'}
            </Text>
            <Text style={styles.summaryLabel}>Active assistance</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {isCompleted ? '1' : '0'}
            </Text>
            <Text style={styles.summaryLabel}>Completed requests</Text>
          </View>
        </View>

                <Text style={styles.sectionHeading}>VOLUNTEER MANAGEMENT</Text>

        <View style={styles.volunteerManagementCard}>
          {volunteers.map((volunteer) => (
            <View
              key={volunteer.id}
              style={styles.volunteerManagementRow}
            >
              <View style={styles.volunteerManagementInfo}>
                <Text style={styles.volunteerManagementName}>
                  {volunteer.name}
                </Text>
                <Text style={styles.volunteerManagementId}>
                  {volunteer.id}
                </Text>
              </View>

              <View
                style={[
                  styles.volunteerStatusBadge,
                  volunteer.isAvailable
                    ? styles.volunteerOnDuty
                    : styles.volunteerOffDuty,
                ]}
              >
                <Text
                  style={[
                    styles.volunteerStatusText,
                    volunteer.isAvailable
                      ? styles.volunteerOnDutyText
                      : styles.volunteerOffDutyText,
                  ]}
                >
                  {volunteer.isAvailable ? 'ON DUTY' : 'OFF DUTY'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionHeading}>REQUEST MONITORING</Text>

        {!request && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No current requests</Text>
            <Text style={styles.emptyText}>
              Requests submitted from the Public screen will appear here.
            </Text>
          </View>
        )}

        {request && (
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestReference}>
                {request.id}
              </Text>

              <View
                style={[
                  styles.requestBadge,
                  isWaiting
                    ? styles.waitingBadge
                    : isCompleted
                      ? styles.completedBadge
                      : isCancelled
                      ? styles.cancelledBadge
                      : styles.activeBadge,
                ]}
              >
                <Text style={styles.badgeText}>
                  {request.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.requesterName}>
              {request.requesterName}
            </Text>

            <Text style={styles.detailLabel}>LOCATION</Text>
            <Text style={styles.detailValue}>
              {request.locationLabel}
            </Text>

            <Text style={styles.detailLabel}>ASSIGNED VOLUNTEER</Text>
            <Text style={styles.detailValue}>
              {request.assignedVolunteerName ?? 'Not yet assigned'}
              {request.timeoutEscalated && (
                <View style={styles.timeoutAlert}>
                  <Text style={styles.timeoutAlertTitle}>
                    TIMEOUT – NO VOLUNTEER ACCEPTED
                  </Text>

                  <Text style={styles.timeoutAlertText}>
                    This request exceeded its waiting period. Organiser escalation
                    and trusted-contact notifications have been triggered in this demo.
                  </Text>

                  <Text style={styles.timeoutAlertNote}>
                    DEMONSTRATION ONLY – NO REAL NOTIFICATIONS SENT
                  </Text>

                  {timeoutEscalation?.requestId === request.id && (
                  <View style={styles.notifiedContacts}>
                    <Text style={styles.notifiedContactsHeading}>
                      TRUSTED CONTACTS SELECTED
                    </Text>

                    {timeoutEscalation.notifiedContactIds.length === 0 ? (
                      <Text style={styles.notifiedContactsText}>
                        No confirmed trusted contacts were available.
                      </Text>
                    ) : (
                      timeoutEscalation.notifiedContactIds.map((contactId) => {
                        const contact = trustedContacts.find(
                          (item) => item.id === contactId,
                        );

                        return contact ? (
                          <View key={contact.id} style={styles.smsPreviewCard}>
                            <Text style={styles.notifiedContactsText}>
                              ✓ {contact.name} ({contact.relationship})
                            </Text>

                            <Text style={styles.smsPreviewHeading}>
                              SMS NOTIFICATION PREVIEW
                            </Text>

                            <Text style={styles.smsPreviewMessage}>
                              Hi {contact.name},

                              Someone who has nominated you as a trusted contact
                              has requested assistance through Safe Steps.

                              Our volunteers are being alerted and the request
                              is being monitored.

                              You do not need to attend in person. If you believe
                              someone is in immediate danger, please call 999.

                              This is a demonstration message. No SMS has been sent.
                            </Text>
                          </View>
                        ) : null;
                      })
                    )}
                  </View>
                )}
                </View>
              )}
            </Text>
            {request.assignedVolunteerId && (
              <>
                <Text style={styles.detailLabel}>VOLUNTEER ID</Text>
                <Text style={styles.detailValue}>
                  {request.assignedVolunteerId}
                </Text>
              </>
            )}
            {(request.status === 'accepted' ||
              request.status === 'contacted') && (
              <View style={styles.reassignmentSection}>
                <Text style={styles.detailLabel}>
                  REASSIGN VOLUNTEER
                </Text>

                <Text style={styles.reassignmentDescription}>
                  Select another volunteer who is currently on duty.
                </Text>

                {volunteers.filter(
                  (volunteer) =>
                    volunteer.isAvailable &&
                    volunteer.id !== request.assignedVolunteerId,
                ).length === 0 ? (
                  <Text style={styles.reassignmentDescription}>
                    No other volunteers are currently available.
                  </Text>
                ) : (
                  volunteers
                    .filter(
                      (volunteer) =>
                        volunteer.isAvailable &&
                        volunteer.id !== request.assignedVolunteerId,
                    )
                    .map((volunteer) => (
                      <Pressable
                        key={volunteer.id}
                        style={[
                          styles.reassignmentVolunteerOption,
                          selectedVolunteerId === volunteer.id &&
                            styles.selectedReassignmentVolunteer,
                        ]}
                        onPress={() =>
                          setSelectedVolunteerId(volunteer.id)
                        }
                      >
                        <Text style={styles.reassignmentVolunteerName}>
                          {volunteer.name}
                        </Text>

                        <Text style={styles.reassignmentVolunteerStatus}>
                          ON DUTY
                        </Text>
                      </Pressable>
                    ))
                )}

                <Pressable
                  style={[
                    styles.reassignButton,
                    !selectedVolunteerId && styles.reassignButtonDisabled,
                  ]}
                  disabled={!selectedVolunteerId}
                  onPress={handleReassignPress}
                >
                  <Text style={styles.reassignButtonText}>
                    REASSIGN VOLUNTEER
                  </Text>
                </Pressable>
              </View>
            )}
            
          </View>
        )}

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Organiser responsibilities</Text>
          <Text style={styles.noticeText}>
            Monitor incoming requests and ensure that assistance is progressing.
            Acceptance of a request does not necessarily mean the person has
            received assistance.
          </Text>
        </View>

        <View style={styles.emergencyNote}>
          <Text style={styles.emergencyText}>
            Safe Steps is not an emergency service. Call 999 if someone is in
            immediate danger.
          </Text>
        </View>

        <Text style={styles.footer}>
          Safe Steps · Organiser support
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#173B57',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#526575',
    marginTop: 7,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#71808D',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  greenDot: {
    backgroundColor: '#238B57',
  },
  redDot: {
    backgroundColor: '#D93636',
  },
  serviceStatus: {
    fontSize: 18,
    fontWeight: '800',
  },
  greenText: {
    color: '#238B57',
  },
  redText: {
    color: '#D93636',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#526575',
    marginTop: 12,
  },
  serviceButton: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  turnOnButton: {
    backgroundColor: '#238B57',
  },
  turnOffButton: {
    backgroundColor: '#D93636',
  },
  serviceButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  demoNote: {
    fontSize: 12,
    lineHeight: 18,
    color: '#8795A1',
    marginTop: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#173B57',
    marginBottom: 13,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 17,
    minHeight: 112,
  },
  summaryNumber: {
    fontSize: 27,
    fontWeight: '800',
    color: '#173B57',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#526575',
    marginTop: 5,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1fcc70',
    marginTop: 5,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#526575',
    marginTop: 5,
  },
  summaryNote: {
    fontSize: 11,
    color: '#8795A1',
    marginTop: 4,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 22,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#173B57',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#71808D',
    textAlign: 'center',
    marginTop: 8,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DCE4EA',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  requestReference: {
    fontSize: 12,
    fontWeight: '800',
    color: '#71808D',
  },
  requestBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  waitingBadge: {
    backgroundColor: '#FFF1D6',
  },
  activeBadge: {
    backgroundColor: '#E5F0FA',
  },
  completedBadge: {
    backgroundColor: '#E5F5EC',
  },
  cancelledBadge: {
    backgroundColor: '#EEEEEE',
  },  
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#173B57',
  },
  requesterName: {
    fontSize: 21,
    fontWeight: '800',
    color: '#173B57',
    marginBottom: 18,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#71808D',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 15,
    color: '#173B57',
    marginBottom: 16,
  },
  noticeCard: {
    backgroundColor: '#EAF1F6',
    borderRadius: 12,
    padding: 17,
    marginBottom: 20,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173B57',
    marginBottom: 7,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#526575',
  },

  emergencyNote: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#D93636',
    padding: 15,
    borderRadius: 10,
  },
  emergencyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#526575',
  },
    volunteerManagementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  volunteerManagementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF1',
  },
  volunteerManagementInfo: {
    flex: 1,
  },
  volunteerManagementName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#173B57',
  },
  volunteerManagementId: {
    fontSize: 12,
    color: '#8795A1',
    marginTop: 4,
  },
  volunteerStatusBadge: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },
  volunteerOnDuty: {
    backgroundColor: '#E5F5EC',
  },
  volunteerOffDuty: {
    backgroundColor: '#F1F3F5',
  },
  volunteerStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  volunteerOnDutyText: {
    color: '#176B40',
  },
  volunteerOffDutyText: {
    color: '#71808D',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8795A1',
    marginTop: 25,
  },
    reassignmentSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  reassignmentDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 19,
  },

  reassignmentVolunteerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginBottom: 8,
  },

  selectedReassignmentVolunteer: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },

  reassignmentVolunteerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
  },

  reassignmentVolunteerStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16803C',
  },

  reassignButton: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },

  reassignButtonDisabled: {
    backgroundColor: '#AAAAAA',
  },

  reassignButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
    timeoutCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  timeoutValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222222',
    marginVertical: 12,
  },

  timeoutOptions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },

  timeoutOption: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  selectedTimeoutOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  timeoutOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },

  selectedTimeoutOptionText: {
    color: '#FFFFFF',
  },
  timeoutAlert: {
    backgroundColor: '#FFF0E6',
    borderLeftWidth: 4,
    borderLeftColor: '#D93636',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    marginBottom: 12,
  },

  timeoutAlertTitle: {
    color: '#B52B2B',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },

  timeoutAlertText: {
    color: '#70412F',
    fontSize: 13,
    lineHeight: 20,
  },

  timeoutAlertNote: {
    color: '#B52B2B',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  notifiedContacts: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginTop: 14,
  },

  notifiedContactsHeading: {
    color: '#173B57',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.4,
  },

  notifiedContactsText: {
    color: '#237A45',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },
  smsPreviewCard: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#DCE3E9',
  },

  smsPreviewHeading: {
    color: '#173B57',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  smsPreviewMessage: {
    color: '#526575',
    fontSize: 13,
    lineHeight: 21,
  },
});