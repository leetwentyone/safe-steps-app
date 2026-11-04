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

export type AssistanceRequest = {
  id: string;
  requesterName: string;
  locationLabel: string;
  status: AssistanceStatus;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
};

type AssistanceContextType = {
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
  resetDemo: () => void;
};

const AssistanceContext =
  createContext<AssistanceContextType | undefined>(undefined);

    export function AssistanceProvider({
      children,
    }: PropsWithChildren) {
      const [request, setRequest] =
        useState<AssistanceRequest | null>(null);
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
    const [volunteerAvailable, setVolunteerAvailable] = useState(false);

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

  function resetDemo() {
    setRequest(null);
  }

  return (
    <AssistanceContext.Provider
      value={{
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
