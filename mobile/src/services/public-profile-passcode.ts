import { pbkdf2Async } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { getRandomBytes } from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const PASSCODE_SALT_KEY = 'safe_steps_public_passcode_salt';
const PASSCODE_HASH_KEY = 'safe_steps_public_passcode_hash';
const PASSCODE_ATTEMPTS_KEY = 'safe_steps_public_passcode_attempts';

const PASSCODE_LENGTH = 6;
const SALT_LENGTH = 16;
const HASH_LENGTH = 32;
const PBKDF2_ITERATIONS = 310_000;
const MAX_ATTEMPTS = 5;

function isValidPasscode(passcode: string): boolean {
  return /^\d{6}$/.test(passcode);
}

async function derivePasscodeHash(
  passcode: string,
  salt: Uint8Array,
): Promise<Uint8Array> {
  return pbkdf2Async(sha256, passcode, salt, {
    c: PBKDF2_ITERATIONS,
    dkLen: HASH_LENGTH,
    asyncTick: 100,
  });
}

export async function createPublicProfilePasscode(
  passcode: string,
): Promise<void> {
  if (!isValidPasscode(passcode)) {
    throw new Error('Your passcode must contain exactly six digits.');
  }

  const salt = getRandomBytes(SALT_LENGTH);
  const hash = await derivePasscodeHash(passcode, salt);

  await SecureStore.setItemAsync(
    PASSCODE_SALT_KEY,
    bytesToHex(salt),
  );

  await SecureStore.setItemAsync(
    PASSCODE_HASH_KEY,
    bytesToHex(hash),
  );

  await SecureStore.deleteItemAsync(PASSCODE_ATTEMPTS_KEY);
}

export async function verifyPublicProfilePasscode(
  passcode: string,
): Promise<boolean> {
  if (!isValidPasscode(passcode)) {
    return false;
  }

  const [storedSalt, storedHash, storedAttempts] = await Promise.all([
    SecureStore.getItemAsync(PASSCODE_SALT_KEY),
    SecureStore.getItemAsync(PASSCODE_HASH_KEY),
    SecureStore.getItemAsync(PASSCODE_ATTEMPTS_KEY),
  ]);

  if (!storedSalt || !storedHash) {
    throw new Error('No passcode has been created.');
  }

  const attempts = Number(storedAttempts ?? '0');

  if (attempts >= MAX_ATTEMPTS) {
    throw new Error('Too many attempts. Please reset your passcode.');
  }

  const salt = hexToBytes(storedSalt);
  const expectedHash = hexToBytes(storedHash);

  const actualHash = await derivePasscodeHash(passcode, salt);

  const matches =
    actualHash.length === expectedHash.length &&
    actualHash.every((value, index) => value === expectedHash[index]);

  if (matches) {
    await SecureStore.deleteItemAsync(PASSCODE_ATTEMPTS_KEY);
    return true;
  }

  await SecureStore.setItemAsync(
    PASSCODE_ATTEMPTS_KEY,
    String(attempts + 1),
  );

  return false;
}

export async function hasPublicProfilePasscode(): Promise<boolean> {
  const storedHash = await SecureStore.getItemAsync(PASSCODE_HASH_KEY);
  return storedHash !== null;
}

export async function clearPublicProfilePasscode(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(PASSCODE_SALT_KEY),
    SecureStore.deleteItemAsync(PASSCODE_HASH_KEY),
    SecureStore.deleteItemAsync(PASSCODE_ATTEMPTS_KEY),
  ]);
}