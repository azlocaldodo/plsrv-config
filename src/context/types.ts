// Component types
export interface ComponentOption {
  articleNumber: string;
  description: string;
  category: string;
}

// Server model definition
export interface ServerModel {
  id: string;
  name: string;
  maxNodes: number;
  gpuSupport: boolean;
  nicOnboard: string;
  maxMemorySlots: number;
  maxStorageDrives: number;
}

// PCIe slot configuration
export interface PcieSlotConfig {
  ocp: string;       // OCP 3.0 x16 - "frei" or component article number
  slot1: string;     // PCIe 1 x16 FH/FL - "frei" or component article number
  slot2: string;     // PCIe 2 x8 HH/HL - "frei" or component article number
  slot3: string;     // PCIe 3 x16 HH/HL - "frei" or component article number
}

// Network configuration
export interface NetworkConfig {
  cable: string;
  transceiver: string;
  transceiverQty: number;
}

// Full server configuration
export interface ServerConfiguration {
  modelId: string;
  application: string;
  nodeCount: number;
  cpu: string;
  memory: {
    type: string;
    quantity: number;
  };
  storage: {
    type: string;
    quantity: number;
  };
  pcieSlots: PcieSlotConfig;
  bootSsd: string;
  tpm: string;
  network: NetworkConfig;
  service: string;
}

// BOM item with pricing
export interface BomItem {
  category: string;
  articleNumber: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Price map for localStorage
export interface PriceMap {
  [articleNumber: string]: number;
}

// Price state
export interface PriceState {
  prices: PriceMap;
  lastUpdated: string;
  currency: string;
}

// Configurator action types
export type ConfiguratorAction =
  | { type: 'SET_MODEL'; payload: string }
  | { type: 'SET_APPLICATION'; payload: string }
  | { type: 'SET_NODE_COUNT'; payload: number }
  | { type: 'SET_CPU'; payload: string }
  | { type: 'SET_MEMORY_TYPE'; payload: string }
  | { type: 'SET_MEMORY_QUANTITY'; payload: number }
  | { type: 'SET_STORAGE_TYPE'; payload: string }
  | { type: 'SET_STORAGE_QUANTITY'; payload: number }
  | { type: 'SET_PCIE_OCP'; payload: string }
  | { type: 'SET_PCIE_SLOT1'; payload: string }
  | { type: 'SET_PCIE_SLOT2'; payload: string }
  | { type: 'SET_PCIE_SLOT3'; payload: string }
  | { type: 'SET_BOOT_SSD'; payload: string }
  | { type: 'SET_CABLE'; payload: string }
  | { type: 'SET_TRANSCEIVER'; payload: string }
  | { type: 'SET_TRANSCEIVER_QTY'; payload: number }
  | { type: 'SET_SERVICE'; payload: string }
  | { type: 'RESET_CONFIG' };

// Price action types
export type PriceAction =
  | { type: 'SET_PRICE'; payload: { articleNumber: string; price: number } }
  | { type: 'SET_PRICES'; payload: PriceMap }
  | { type: 'IMPORT_PRICES'; payload: PriceMap }
  | { type: 'RESET_PRICES' };
