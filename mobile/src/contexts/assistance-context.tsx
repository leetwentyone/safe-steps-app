import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

export type AssistanceStatus =
  | 'waiting'
  | 'accepted'
  | 'contacted'
  | 'completed'
  | 'cancelled';

export type DemoVolunteer = {
  id: string;
  name: string;
  isAvailable: boolean;
};

export type TrustedContactStatus =
  | 'pending'
  | 'confirmed'
  | 'declined';

export type TrustedContact = {
  id: string;
  name: string;
  relationship: string;
  mobileNumber: string;
  status: TrustedContactStatus;
};

export type AssistanceRequest = {
  id: string;
  requesterName: string;
  locationLabel: string;
  status: AssistanceStatus;
  timeoutAt: number;
  timeoutEscalated: boolean;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
};

type AssistanceContextType = {
  trustedContacts: TrustedContact[];
  addTrustedContact: (
    contact: Omit<TrustedContact, 'id' | 'status'>,
  ) => boolean;
  removeTrustedContact: (contactId: string) => void;
  updateTrustedContactStatus: (
    contactId: string,
    status: TrustedContactStatus,
  ) => void;
  requestTimeoutMinutes: number;
  setRequestTimeoutMinutes: (minutes: number) => void;
  volunteers: DemoVolunteer[];
  setVolunteers: (volunteers: DemoVolunteer[]) => void;
  updateVolunteerAvailability: (
    volunteerId: string,
    isAvailable: boolean,
  ) => void;
  serviceEnabled: boolean;
  setServiceEnabled: (enabled: boolean) => void;
  volunteerAvailable: boolean;
  setVolunteerAvailable: (available: boolean) => void;
  request: AssistanceRequest | null;
  createDemoRequest: () => void;
  acceptRequest: (volunteerId: string) => void;
  reassignRequest: (volunteerId: string) => void;
  markContactMade: () => void;
  completeRequest: () => void;
  cancelRequest: () => void;
  markRequestTimedOut: () => void;
  resetDemo: () => void;
};

const AssistanceContext =
  createContext<AssistanceContextType | undefined>(undefined);

    export function AssistanceProvider({
      children,
    }: PropsWithChildren) {
      const [request, setRequest] =
        useState<AssistanceRequest | null>(null);
        const [trustedContacts, setTrustedContacts] =
        useState<TrustedContact[]>([]);
        const [volunteers, setVolunteers] = useState<DemoVolunteer[]>([
      {
        id: 'vol-001',
        name: 'Demo Volunteer',
        isAvailable: false,
      },
      {
        id: 'vol-002',
        name: 'Sam Taylor',
        isAvailable: false,
      },
      {
        id: 'vol-003',
        name: 'Jordan Lee',
        isAvailable: false,
      },
    ]);
    const [serviceEnabled, setServiceEnabled] = useState(false);

    const [requestTimeoutMinutes, setRequestTimeoutMinutes] =
      useState(2);

    const [volunteerAvailable, setVolunteerAvailable] = useState(false);

    function addTrustedContact(
      contact: Omit<TrustedContact, 'id' | 'status'>,
    ): boolean {
    if (trustedContacts.length >= 5) {
      return false;
    }

    const newContact: TrustedContact = {
      ...contact,
      id: `contact-${Date.now()}`,
      status: 'pending',
    };

    setTrustedContacts((currentContacts) => {
      if (currentContacts.length >= 5) {
        return currentContacts;
      }

      return [...currentContacts, newContact];
    });

    return true;
  }

  function removeTrustedContact(contactId: string) {
    setTrustedContacts((currentContacts) =>
      currentContacts.filter(
        (contact) => contact.id !== contactId,
      ),
    );
  }

  function updateTrustedContactStatus(
    contactId: string,
    status: TrustedContactStatus,
  ) {
    setTrustedContacts((currentContacts) =>
      currentContacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, status }
          : contact,
      ),
    );
  }

  function updateVolunteerAvailability(
    volunteerId: string,
    isAvailable: boolean,
  ) {
    setVolunteers((currentVolunteers) =>
      currentVolunteers.map((volunteer) =>
        volunteer.id === volunteerId
          ? { ...volunteer, isAvailable }
          : volunteer,
      ),
    );
  }

  function createDemoRequest() {
    setRequest({
      id: 'SS-DEMO-001',
      requesterName: 'Alex Morgan',
      locationLabel: 'Town Centre, Demo Location',
      status: 'waiting',
      timeoutAt: Date.now() + requestTimeoutMinutes * 60 * 1000,
      timeoutEscalated: false,
    });
  }

  function acceptRequest(volunteerId: string) {
    if (!serviceEnabled) {
      return;
    }

    const volunteer = volunteers.find(
      (item) => item.id === volunteerId,
    );

    if (!volunteer || !volunteer.isAvailable) {
      return;
    }

    setRequest((currentRequest) => {
      if (!currentRequest || currentRequest.status !== 'waiting') {
        return currentRequest;
      }

      return {
        ...currentRequest,
        status: 'accepted',
        assignedVolunteerId: volunteer.id,
        assignedVolunteerName: volunteer.name,
      };
    });
  }

  function reassignRequest(volunteerId: string) {
    if (!serviceEnabled) {
      return;
    }

    const volunteer = volunteers.find(
      (item) => item.id === volunteerId && item.isAvailable,
    );

    if (!volunteer) {
      return;
    }

    setRequest((currentRequest) => {
      if (
        !currentRequest ||
        !['accepted', 'contacted'].includes(currentRequest.status)
      ) {
        return currentRequest;
      }

      return {
        ...currentRequest,
        assignedVolunteerId: volunteer.id,
        assignedVolunteerName: volunteer.name,
      };
    });
  }

  function markContactMade() {
    setRequest((currentRequest) => {
      if (!currentRequest || currentRequest.status !== 'accepted') {
        return currentRequest;
      }

      return {
        ...currentRequest,
        status: 'contacted',
      };
    });
  }

  function completeRequest() {
    setRequest((currentRequest) => {
      if (!currentRequest || currentRequest.status !== 'contacted') {
        return currentRequest;
      }

      return {
        ...currentRequest,
        status: 'completed',
      };
    });
  }

  function cancelRequest() {
    setRequest((currentRequest) => {
      if (!currentRequest || currentRequest.status !== 'waiting') {
        return currentRequest;
      }

      return {
        ...currentRequest,
        status: 'cancelled',
      };
    });
  }

  function markRequestTimedOut() {
    setRequest((currentRequest) => {
      if (
        !currentRequest ||
        currentRequest.status !== 'waiting' ||
        currentRequest.timeoutEscalated
      ) {
        return currentRequest;
      }

      return {
        ...currentRequest,
        timeoutEscalated: true,
      };
    });
  }

  function resetDemo() {
    setRequest(null);
  }

  return (
    <AssistanceContext.Provider
      value={{
        trustedContacts,
        addTrustedContact,
        removeTrustedContact,
        updateTrustedContactStatus,
        requestTimeoutMinutes,
        setRequestTimeoutMinutes,
        volunteers,
        setVolunteers,
        updateVolunteerAvailability,
        serviceEnabled,
        setServiceEnabled,
        volunteerAvailable,
        setVolunteerAvailable,
        request,
        createDemoRequest,
        acceptRequest,
        reassignRequest,
        markContactMade,
        completeRequest,
        cancelRequest,
        markRequestTimedOut,
        resetDemo,
      }}
    >
      {children}
    </AssistanceContext.Provider>
  );
}

export function useAssistance() {
  const context = useContext(AssistanceContext);

  if (!context) {
    throw new Error(
      'useAssistance must be used inside an AssistanceProvider',
    );
  }

  return context;
}
