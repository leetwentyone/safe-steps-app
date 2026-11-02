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
  | 'completed';

export type AssistanceRequest = {
  id: string;
  requesterName: string;
  locationLabel: string;
  status: AssistanceStatus;
  assignedVolunteerName?: string;
};

type AssistanceContextType = {
  serviceEnabled: boolean;
  setServiceEnabled: (enabled: boolean) => void;
  request: AssistanceRequest | null;
  createDemoRequest: () => void;
  acceptRequest: (volunteerName: string) => void;
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
    const [serviceEnabled, setServiceEnabled] = useState(false);

  function createDemoRequest() {
    setRequest({
      id: 'SS-DEMO-001',
      requesterName: 'Alex Morgan',
      locationLabel: 'Town Centre, Demo Location',
      status: 'waiting',
    });
  }

  function acceptRequest(volunteerName: string) {
    if (!serviceEnabled) {
      return;
    }
    setRequest((currentRequest) => {
      if (!currentRequest || currentRequest.status !== 'waiting') {
        return currentRequest;
      }

      return {
        ...currentRequest,
        status: 'accepted',
        assignedVolunteerName: volunteerName,
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

      return null;
    });
  }

  function resetDemo() {
    setRequest(null);
  }

  return (
    <AssistanceContext.Provider
      value={{
        serviceEnabled,
        setServiceEnabled,
        request,
        createDemoRequest,
        acceptRequest,
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
