import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ServerConfiguration, ConfiguratorAction } from './types';
import { defaultModel } from '../data/serverModels';
import { cpuOptions, memoryOptions, storageOptions, applicationOptions, serviceOptions, cableOptions, transceiverOptions, bootSsdOptions, pcieSlot2Options, pcieSlot3Options, tpmComponent } from '../data/components';

// Initial configuration state
const initialConfiguration: ServerConfiguration = {
  modelId: defaultModel.id,
  application: applicationOptions[0].articleNumber,
  nodeCount: 1,
  cpu: cpuOptions[0].articleNumber,
  memory: {
    type: memoryOptions[0].articleNumber,
    quantity: 12,
  },
  storage: {
    type: storageOptions[0].articleNumber,
    quantity: 4,
  },
  pcieSlots: {
    ocp: 'frei',
    slot1: 'frei',
    slot2: pcieSlot2Options[1].articleNumber,  // Default: RAID controller
    slot3: pcieSlot3Options[1].articleNumber,  // Default: NIC 25Gbit
  },
  bootSsd: bootSsdOptions[0].articleNumber,  // Default: 960GB
  tpm: tpmComponent.articleNumber,
  network: {
    cable: cableOptions[0].articleNumber,
    transceiver: transceiverOptions[0].articleNumber,
    transceiverQty: 2,
  },
  service: serviceOptions[0].articleNumber,
};

// Reducer function
function configuratorReducer(state: ServerConfiguration, action: ConfiguratorAction): ServerConfiguration {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, modelId: action.payload };
    case 'SET_APPLICATION':
      return { ...state, application: action.payload };
    case 'SET_NODE_COUNT':
      return { ...state, nodeCount: action.payload };
    case 'SET_CPU':
      return { ...state, cpu: action.payload };
    case 'SET_MEMORY_TYPE':
      return { ...state, memory: { ...state.memory, type: action.payload } };
    case 'SET_MEMORY_QUANTITY':
      return { ...state, memory: { ...state.memory, quantity: action.payload } };
    case 'SET_STORAGE_TYPE':
      return { ...state, storage: { ...state.storage, type: action.payload } };
    case 'SET_STORAGE_QUANTITY':
      return { ...state, storage: { ...state.storage, quantity: action.payload } };
    case 'SET_PCIE_OCP':
      return { ...state, pcieSlots: { ...state.pcieSlots, ocp: action.payload } };
    case 'SET_PCIE_SLOT1':
      return { ...state, pcieSlots: { ...state.pcieSlots, slot1: action.payload } };
    case 'SET_PCIE_SLOT2':
      return { ...state, pcieSlots: { ...state.pcieSlots, slot2: action.payload } };
    case 'SET_PCIE_SLOT3':
      return { ...state, pcieSlots: { ...state.pcieSlots, slot3: action.payload } };
    case 'SET_BOOT_SSD':
      return { ...state, bootSsd: action.payload };
    case 'SET_CABLE':
      return { ...state, network: { ...state.network, cable: action.payload } };
    case 'SET_TRANSCEIVER':
      return { ...state, network: { ...state.network, transceiver: action.payload } };
    case 'SET_TRANSCEIVER_QTY':
      return { ...state, network: { ...state.network, transceiverQty: action.payload } };
    case 'SET_SERVICE':
      return { ...state, service: action.payload };
    case 'RESET_CONFIG':
      return initialConfiguration;
    default:
      return state;
  }
}

// Context type
interface ConfiguratorContextType {
  configuration: ServerConfiguration;
  dispatch: React.Dispatch<ConfiguratorAction>;
}

// Create context
const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(undefined);

// Provider component
interface ConfiguratorProviderProps {
  children: ReactNode;
}

export function ConfiguratorProvider({ children }: ConfiguratorProviderProps) {
  const [configuration, dispatch] = useReducer(configuratorReducer, initialConfiguration);

  return (
    <ConfiguratorContext.Provider value={{ configuration, dispatch }}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

// Custom hook to use the context
export function useConfigurator() {
  const context = useContext(ConfiguratorContext);
  if (context === undefined) {
    throw new Error('useConfigurator must be used within a ConfiguratorProvider');
  }
  return context;
}

export { initialConfiguration };
