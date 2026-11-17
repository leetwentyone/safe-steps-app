import { apiRequest } from './api';
import {
    deleteAuthToken,
    getAuthToken,
    saveAuthToken,
} from './secure-storage';

type LoginResponse = {
  success: boolean;
  token: string;
  expires_at: string;
};

export type VolunteerProfile = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type ProfileResponse = {
  success: boolean;
  volunteer: VolunteerProfile;
};

type LogoutResponse = {
  success: boolean;
  message: string;
};

export async function volunteerLogin(
  email: string,
  password: string
): Promise<VolunteerProfile> {
  const response = await apiRequest<LoginResponse>(
    '/volunteer/login',
    {
      method: 'POST',
      body: { email, password },
    }
  );

  await saveAuthToken(response.token);

  return await getVolunteerProfile();
}

export async function getVolunteerProfile(): Promise<VolunteerProfile> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('You are not logged in.');
  }

  const response = await apiRequest<ProfileResponse>(
    '/volunteer/me',
    { token }
  );

  return response.volunteer;
}

export async function volunteerLogout(): Promise<void> {
  const token = await getAuthToken();

  try {
    if (token) {
      await apiRequest<LogoutResponse>(
        '/volunteer/logout',
        { method: 'POST', token }
      );
    }
  } finally {
    await deleteAuthToken();
  }
}
