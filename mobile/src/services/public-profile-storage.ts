import * as SecureStore from 'expo-secure-store';

const DEVICE_TOKEN_KEY = 'safe_steps_public_device_token';
const PROFILE_ID_KEY = 'safe_steps_public_profile_id';

export async function savePublicDeviceCredentials(
  profileId: number,
  deviceToken: string,
): Promise<void> {
  if (!Number.isInteger(profileId) || profileId <= 0) {
    throw new Error('Invalid public profile ID.');
  }

  if (!deviceToken || deviceToken.length !== 64) {
    throw new Error('Invalid device authentication token.');
  }

  await SecureStore.setItemAsync(
    DEVICE_TOKEN_KEY,
    deviceToken,
  );

  await SecureStore.setItemAsync(
    PROFILE_ID_KEY,
    String(profileId),
  );
}

export async function getPublicDeviceCredentials(): Promise<{
  profileId: number;
  deviceToken: string;
} | null> {
  const [profileIdValue, deviceToken] = await Promise.all([
    SecureStore.getItemAsync(PROFILE_ID_KEY),
    SecureStore.getItemAsync(DEVICE_TOKEN_KEY),
  ]);

  if (!profileIdValue || !deviceToken) {
    return null;
  }

  const profileId = Number(profileIdValue);

  if (!Number.isInteger(profileId) || profileId <= 0) {
    return null;
  }

  if (deviceToken.length !== 64) {
    return null;
  }

  return {
    profileId,
    deviceToken,
  };
}

export async function clearPublicDeviceCredentials(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(DEVICE_TOKEN_KEY),
    SecureStore.deleteItemAsync(PROFILE_ID_KEY),
  ]);
}