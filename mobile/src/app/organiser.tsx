import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useAssistance } from '@/contexts/assistance-context';

export default function OrganiserScreen() {

  const {
    request,
    serviceEnabled,
    setServiceEnabled,
    volunteerAvailable,
  } = useAssistance();

  const isWaiting = request?.status === 'waiting';

  const isActive =
    request?.status === 'accepted' ||
    request?.status === 'contacted';

  const isCompleted = request?.status === 'completed';

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

        <Text style={styles.sectionHeading}>SERVICE OVERVIEW</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.metricValue}>
              {volunteerAvailable ? '1' : '0'}
            </Text>
            <Text style={styles.metricLabel}>Volunteers on duty</Text>
            <Text style={styles.summaryNote}>
              {volunteerAvailable ? 'Demo Volunteer is available' : 'No volunteers available'}
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
            </Text>
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
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8795A1',
    marginTop: 25,
  },
});