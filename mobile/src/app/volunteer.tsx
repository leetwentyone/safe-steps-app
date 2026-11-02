import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useAssistance } from '@/contexts/assistance-context';

  export default function VolunteerScreen() {

    const [selectedVolunteerId, setSelectedVolunteerId] =
      useState('vol-001');

  const {
    request,
    serviceEnabled,
    volunteers,
    updateVolunteerAvailability,
    acceptRequest,
    markContactMade,
    completeRequest,
    resetDemo,
  } = useAssistance();

  const isMyRequest =
    request?.assignedVolunteerName === 'Demo Volunteer';

    const currentVolunteer = volunteers.find(
     (volunteer) => volunteer.id === selectedVolunteerId,
    );

    const volunteerAvailable = currentVolunteer?.isAvailable ?? false;

  function handleAvailability() {
    if (!volunteerAvailable && !serviceEnabled) {
      Alert.alert(
        'Service unavailable',
        'The Safe Steps service is currently switched off by the organiser. You cannot start a shift right now.'
      );
      return;
    }
    if (
      volunteerAvailable &&
      isMyRequest &&
      (request?.status === 'accepted' ||
        request?.status === 'contacted')
    ) {
      Alert.alert(
        'Active assistance',
        'Please complete or hand over your active assistance request before ending your shift.',
      );
      return;
    }

    updateVolunteerAvailability(
      selectedVolunteerId,
      !volunteerAvailable,
    );
  }

  function handleContactMade() {
    markContactMade();
  }

  function completeAssistance() {
    Alert.alert(
      'Assistance completed',
      'This demonstration request has been marked as completed.',
      [
        {
          text: 'OK',
          onPress: completeRequest,
        },
      ],
    );
  }

  function handleContactPress() {
    Alert.alert(
      'Contact requester',
      'In the finished app, this will allow you to contact the person who requested assistance.',
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>SAFE STEPS</Text>
          <Text style={styles.subtitle}>VOLUNTEER AREA</Text>
        </View>

        <View style={styles.serviceCard}>
          <Text style={styles.sectionLabel}>SERVICE STATUS</Text>
          <View style={styles.statusRow}>
            <View style={styles.greenDot} />
            <Text style={styles.serviceStatus}>
              Demo service is operating
            </Text>
          </View>
          <Text style={styles.smallText}>
            The organiser controls the actual service availability.
          </Text>
        </View>

                <View style={styles.availabilityCard}>
          <Text style={styles.sectionLabel}>SELECT VOLUNTEER</Text>

          {volunteers.map((volunteer) => (
            <Pressable
              key={volunteer.id}
              style={[
                styles.volunteerOption,
                selectedVolunteerId === volunteer.id &&
                  styles.selectedVolunteerOption,
              ]}
              onPress={() => setSelectedVolunteerId(volunteer.id)}
            >
              <Text style={styles.volunteerOptionText}>
                {volunteer.name}
              </Text>

              <Text style={styles.smallText}>
                {volunteer.isAvailable ? 'ON DUTY' : 'OFF DUTY'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.availabilityCard}>
          <Text style={styles.sectionLabel}>YOUR AVAILABILITY</Text>

          <Text style={styles.availabilityTitle}>
            {volunteerAvailable ? 'YOU ARE ON DUTY' : 'YOU ARE NOT ON DUTY'}
          </Text>

          <Text style={styles.availabilityDescription}>
            {volunteerAvailable
              ? 'You are opted in to receive assistance requests.'
              : 'You will not receive assistance requests until you opt in.'}
          </Text>

          <Pressable
            style={[
              styles.availabilityButton,
              volunteerAvailable && styles.unavailableButton,
            ]}
            onPress={handleAvailability}
          >
            <Text style={styles.availabilityButtonText}>
              {volunteerAvailable ? 'END MY SHIFT' : "YES, I'M AVAILABLE"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.requestsSection}>
  <Text style={styles.sectionHeading}>INCOMING REQUESTS</Text>

  {!volunteerAvailable && (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyText}>
        Opt in to your volunteer shift to receive requests.
      </Text>
    </View>
  )}

  {volunteerAvailable && !request && (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyText}>
        No active requests at the moment. Requests submitted from the Public
        tab will appear here.
      </Text>
    </View>
  )}

  {volunteerAvailable && request?.status === 'waiting' && (
    <View style={styles.requestCard}>
      <Text style={styles.requestLabel}>
        NEW ASSISTANCE REQUEST
      </Text>

      <Text style={styles.requestTitle}>
        Someone needs assistance
      </Text>

      <Text style={styles.requestDescription}>
        A member of the public has requested help nearby.
      </Text>

      <Pressable
        style={styles.acceptButton}
        onPress={() => acceptRequest('Demo Volunteer')}
      >
        <Text style={styles.acceptButtonText}>
          ACCEPT REQUEST
        </Text>
      </Pressable>
    </View>
  )}

  {request && isMyRequest && (
    <View style={styles.activeCard}>
      <View style={styles.activeHeader}>
        <Text style={styles.activeHeading}>
          ACTIVE ASSISTANCE
        </Text>

        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>
            {request.status === 'accepted'
              ? 'ACCEPTED'
              : request.status === 'contacted'
                ? 'CONTACT MADE'
                : 'COMPLETED'}
          </Text>
        </View>
      </View>

      <Text style={styles.requesterName}>
        {request.requesterName}
      </Text>

      <Text style={styles.requestDescription}>
        Demo requester · Fictional information
      </Text>

      <View style={styles.detailDivider} />

      <Text style={styles.detailLabel}>REQUEST LOCATION</Text>
      <Text style={styles.detailValue}>
        {request.locationLabel}
      </Text>

      <Text style={styles.detailLabel}>REQUEST REFERENCE</Text>
      <Text style={styles.detailValue}>
        {request.id}
      </Text>

      <View style={styles.detailDivider} />

      <Text style={styles.progressHeading}>
        ASSISTANCE PROGRESS
      </Text>

      <View style={styles.progressRow}>
        <View style={styles.progressDot} />
        <Text style={styles.progressText}>
          Request accepted
        </Text>
      </View>

      <View style={styles.progressRow}>
        <View
          style={[
            styles.progressDot,
            request.status !== 'accepted' &&
              styles.progressDotComplete,
          ]}
        />
        <Text style={styles.progressText}>
          Contact made
        </Text>
      </View>

      <View style={styles.progressRow}>
        <View
          style={[
            styles.progressDot,
            request.status === 'completed' &&
              styles.progressDotComplete,
          ]}
        />
        <Text style={styles.progressText}>
          Assistance completed
        </Text>
      </View>

      {request.status !== 'completed' && (
        <>
          <Pressable
            style={styles.contactButton}
            onPress={handleContactPress}
          >
            <Text style={styles.actionButtonText}>
              CONTACT REQUESTER
            </Text>
          </Pressable>

          {request.status === 'accepted' && (
            <Pressable
              style={styles.contactMadeButton}
              onPress={handleContactMade}
            >
              <Text style={styles.actionButtonText}>
                MARK CONTACT MADE
              </Text>
            </Pressable>
          )}

          {request.status === 'contacted' && (
            <Pressable
              style={styles.completeButton}
              onPress={completeAssistance}
            >
              <Text style={styles.actionButtonText}>
                MARK ASSISTANCE COMPLETED
              </Text>
            </Pressable>
          )}
        </>
      )}

      {request.status === 'completed' && (
        <View style={styles.completedMessage}>
          <Text style={styles.completedMessageText}>
            This assistance request has been completed.
          </Text>
        </View>
      )}

      <Pressable
        style={styles.resetButton}
        onPress={resetDemo}
      >
        <Text style={styles.resetButtonText}>
          Reset demonstration
        </Text>
      </Pressable>
    </View>
  )}

  {volunteerAvailable &&
    request &&
    request.status !== 'waiting' &&
    !isMyRequest && (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>
          This request has already been accepted by another volunteer.
        </Text>
      </View>
    )}
</View>

        <View style={styles.emergencyNote}>
          <Text style={styles.emergencyText}>
            Remember: Safe Steps is not an emergency service. Call 999 if
            someone is in immediate danger.
          </Text>
        </View>

        <Text style={styles.footer}>
          Safe Steps · Volunteer support
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
    padding: 18,
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#71808D',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#238B57',
  },
  serviceStatus: {
    fontSize: 16,
    fontWeight: '700',
    color: '#238B57',
  },
  smallText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#71808D',
    marginTop: 9,
  },
  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 28,
  },
  availabilityTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#173B57',
    textAlign: 'center',
  },
  availabilityDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#526575',
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 20,
  },
  availabilityButton: {
    width: '100%',
    backgroundColor: '#238B57',
    borderRadius: 12,
    paddingVertical: 19,
    alignItems: 'center',
  },
  unavailableButton: {
    backgroundColor: '#526575',
  },
  availabilityButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  requestsSection: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#173B57',
    marginBottom: 13,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#71808D',
    textAlign: 'center',
  },
  demoButton: {
    marginTop: 18,
    backgroundColor: '#173B57',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  requestCard: {
    backgroundColor: '#FFF4DC',
    borderRadius: 14,
    padding: 20,
  },
  requestLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#A56A10',
    marginBottom: 10,
  },
  requestTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#173B57',
  },
  requestDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#526575',
    marginTop: 9,
  },
  acceptButton: {
    backgroundColor: '#238B57',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DCE4EA',
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  activeHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#173B57',
  },
  activeBadge: {
    backgroundColor: '#E5F5EC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#176B40',
  },
  requesterName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#173B57',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#E3E9EE',
    marginVertical: 18,
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
    marginBottom: 15,
  },
  progressHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173B57',
    marginBottom: 15,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 13,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D99A24',
  },
  progressDotComplete: {
    backgroundColor: '#238B57',
  },
  progressText: {
    fontSize: 14,
    color: '#526575',
  },
  contactButton: {
    backgroundColor: '#173B57',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  contactMadeButton: {
    backgroundColor: '#238B57',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  completeButton: {
    backgroundColor: '#238B57',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  completedMessage: {
    backgroundColor: '#E5F5EC',
    padding: 14,
    borderRadius: 10,
    marginTop: 15,
  },
  completedMessageText: {
    color: '#176B40',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  resetButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
  },
  resetButtonText: {
    color: '#71808D',
    fontSize: 13,
    textDecorationLine: 'underline',
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
    volunteerOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3E8',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  selectedVolunteerOption: {
    borderColor: '#176B40',
    borderWidth: 2,
    backgroundColor: '#E5F5EC',
  },
  volunteerOptionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#263746',
    marginBottom: 5,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8795A1',
    marginTop: 25,
  },
});
