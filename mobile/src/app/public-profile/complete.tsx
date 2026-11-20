import { router } from 'expo-router';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function PublicProfileCompleteScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.successIcon}>
        <Text style={styles.successTick}>✓</Text>
      </View>

      <Text style={styles.heading}>
        Your Safety Profile is ready
      </Text>

      <Text style={styles.description}>
        Your email has been verified and your passcode has been created.
        Your Safety Profile is now set up on this device.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          What happens next?
        </Text>

        <Text style={styles.infoText}>
          You can now add up to five emergency contacts to your
          Safety Profile.
        </Text>

        <Text style={styles.infoText}>
          These contacts can help Safe Steps support you if you
          ever need assistance.
        </Text>

        <Text style={styles.infoText}>
          Your profile is optional. You can still request help
          without using a Safety Profile.
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.primaryButtonText}>
          Return to Safe Steps
        </Text>
      </Pressable>

      <Text style={styles.footer}>
        Safe Steps is not an emergency service. If you are in
        immediate danger, call 999.
      </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E8F3EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
  },
  successTick: {
    fontSize: 42,
    fontWeight: '700',
    color: '#238B57',
  },
  heading: {
    fontSize: 27,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 28,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 18,
    marginBottom: 28,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#333333',
    marginBottom: 12,
  },
  primaryButton: {
    width: '100%',
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
  footer: {
    fontSize: 12,
    lineHeight: 18,
    color: '#555555',
    textAlign: 'center',
    marginTop: 28,
  },
});