import { ServerModel } from '../context/types';

// Server model definition for A1E15-12
export const serverModels: ServerModel[] = [
  {
    id: 'A1E15-12',
    name: 'primeLine Golden Series AMD A1E15-12',
    maxNodes: 3,
    gpuSupport: false,
    nicOnboard: '2x 1Gb Intel i350',
    maxMemorySlots: 12,
    maxStorageDrives: 12,
  },
];

// Default model
export const defaultModel = serverModels[0];

// Get model by ID
export function getModelById(id: string): ServerModel | undefined {
  return serverModels.find(m => m.id === id);
}