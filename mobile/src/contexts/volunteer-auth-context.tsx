import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

import {
    getVolunteerProfile,
    volunteerLogin,
    volunteerLogout,
    type VolunteerProfile,
} from '@/services/volunteer-auth';

import {
    deleteAuthToken,
    getAuthToken,
} from '@/services/secure-storage';

type VolunteerAuthContextType = {
  volunteer: VolunteerProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const VolunteerAuthContext =
  createContext<VolunteerAuthContextType | undefined>(undefined);

export function VolunteerAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [volunteer, setVolunteer] =
    useState<VolunteerProfile | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await getAuthToken();

        if (token) {
          const profile = await getVolunteerProfile();
          setVolunteer(profile);
        }
      } catch {
        await deleteAuthToken();
        setVolunteer(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function signIn(
    email: string,
    password: string
  ): Promise<void> {
    const profile = await volunteerLogin(email, password);
    setVolunteer(profile);
  }

  async function signOut(): Promise<void> {
    try {
      await volunteerLogout();
    } finally {
      setVolunteer(null);
    }
  }

  return (
    <VolunteerAuthContext.Provider
      value={{
        volunteer,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </VolunteerAuthContext.Provider>
  );
}

export function useVolunteerAuth() {
  const context = useContext(VolunteerAuthContext);

  if (!context) {
    throw new Error(
      'useVolunteerAuth must be used within VolunteerAuthProvider.'
    );
  }

  return context;
}