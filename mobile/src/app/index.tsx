
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

export default function HomeScreen() {
  const {
    request,
    createDemoRequest,
    cancelRequest,
    resetDemo,
  } = useAssistance();

  const requestStatus = request?.status ?? 'idle';

  function handleHelpPress() {
    createDemoRequest();

    Alert.alert(
      'Demo request submitted',
      'This is a prototype. No real volunteer has been contacted.',
    );
  }

  function handleCancelPress() {
    if (requestStatus === 'waiting') {
      cancelRequest();
    } else {
      resetDemo();
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>SAFE STEPS</Text>
          <Text style={styles.tagline}>
            Here when you need a helping hand.
          </Text>
        </View>

        <View style={styles.intro}>
          <Text style={styles.heading}>Need a little help?</Text>
          <Text style={styles.description}>
            Request assistance from an available Safe Steps volunteer nearby.
          </Text>
        </View>

        <View style={styles.helpSection}>
          <Pressable
            style={[
              styles.helpButton,
              requestStatus === 'waiting' && styles.helpButtonWaiting,
              requestStatus !== 'idle' &&
                requestStatus !== 'waiting' &&
                styles.helpButtonAccepted,
            ]}
            onPress={
              requestStatus === 'idle' ? handleHelpPress : undefined
            }
            accessibilityRole="button"
            accessibilityLabel="Request help"
          >
            <Text style={styles.helpButtonText}>
              {requestStatus === 'idle'
                ? 'HELP'
                : requestStatus === 'waiting'
                  ? 'REQUEST SENT'
                  : 'ACCEPTED'}
            </Text>

            <Text style={styles.helpButtonSubtext}>
              {requestStatus === 'idle'
                ? 'Tap here to request help'
                : requestStatus === 'waiting'
                  ? 'Waiting for a volunteer'
                  : 'A volunteer has accepted'}
            </Text>
          </Pressable>
        </View>

        {request && (
          <View
            style={[
              styles.statusCard,
              requestStatus !== 'waiting' && styles.acceptedStatusCard,
            ]}
          >
            <Text
              style={[
                styles.statusTitle,
                requestStatus !== 'waiting' && styles.acceptedStatusText,
              ]}
            >
              {requestStatus === 'waiting'
                ? 'Your request has been submitted'
                : requestStatus === 'accepted'
                  ? 'A volunteer has accepted your request'
                  : requestStatus === 'contacted'
                    ? 'The volunteer has made contact'
                    : 'Assistance has been completed'}
            </Text>

            <Text
              style={[
                styles.statusDescription,
                requestStatus !== 'waiting' && styles.acceptedStatusText,
              ]}
            >
              {requestStatus === 'waiting'
                ? "We're waiting for a volunteer to accept your request."
                : requestStatus === 'accepted'
                  ? `${request.assignedVolunteerName} has accepted your request. They will contact you shortly.`
                  : requestStatus === 'contacted'
                    ? 'The volunteer has marked that they have made contact with you.'
                    : 'The volunteer has marked this assistance request as completed.'}
            </Text>

            {requestStatus === 'waiting' && (
              <Pressable
                onPress={handleCancelPress}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel request
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={resetDemo}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Reset demo</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyTitle}>In an emergency?</Text>
          <Text style={styles.emergencyText}>
            Safe Steps is not an emergency service. If you are in immediate
            danger or need urgent medical assistance, please call 999.
          </Text>
        </View>

        <Text style={styles.footer}>
          Safe Steps · Community support
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
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 42,
  },
  logo: {
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#173B57',
  },
  tagline: {
    fontSize: 14,
    color: '#526575',
    marginTop: 8,
  },
  intro: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#173B57',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#526575',
    textAlign: 'center',
    marginTop: 12,
  },
  helpSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
  },
  helpButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#D93636',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  helpButtonWaiting: {
    backgroundColor: '#D99A24',
  },
  helpButtonAccepted: {
    backgroundColor: '#238B57',
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 2,
  },
  helpButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  statusCard: {
    width: '100%',
    backgroundColor: '#FFF4DC',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    alignItems: 'center',
  },
  acceptedStatusCard: {
    backgroundColor: '#E5F5EC',
  },
  statusTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#80530C',
    textAlign: 'center',
  },
  acceptedStatusText: {
    color: '#176B40',
  },
  statusDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#80530C',
    textAlign: 'center',
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 14,
    padding: 10,
  },
  cancelButtonText: {
    color: '#80530C',
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  emergencyCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#D93636',
  },
  emergencyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#B52B2B',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#526575',
  },
  footer: {
    fontSize: 12,
    color: '#8795A1',
    marginTop: 28,
  },
});
