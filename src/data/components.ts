import { ComponentOption } from '../context/types';

// CPU options from Excel Listen sheet
export const cpuOptions: ComponentOption[] = [
  { articleNumber: '130651', description: 'CPU AMD EPYC | SP5 ** | 9115 | 2.6GHz | 16-Core | 125W | Turin', category: 'CPU' },
  { articleNumber: '130652', description: 'CPU AMD EPYC | SP5 ** | 9135 | 3.65GHz | 16-Core | 200W | Turin', category: 'CPU' },
  { articleNumber: '130653', description: 'CPU AMD EPYC | SP5 ** | 9175F | 4.2GHz | 16-Core | 320W | Turin', category: 'CPU' },
  { articleNumber: '130654', description: 'CPU AMD EPYC | SP5 ** | 9255 | 3.25GHz | 24-Core | 200W | Turin', category: 'CPU' },
  { articleNumber: '130657', description: 'CPU AMD EPYC | SP5 ** | 9355 | 3.55GHz | 32-Core | 280W | Turin', category: 'CPU' },
  { articleNumber: '130685', description: 'CPU AMD EPYC | SP5 ** | 9355P | 3.55GHz | 32-Core | 280W | Turin', category: 'CPU' },
  { articleNumber: '130658', description: 'CPU AMD EPYC | SP5 ** | 9375F | 3.85GHz | 32-Core | 320W | Turin', category: 'CPU' },
  { articleNumber: '130662', description: 'CPU AMD EPYC | SP5 ** | 9555P | 3.2GHz | 64-Core | 360W | Turin', category: 'CPU' },
];

// Memory options from Excel Listen sheet
export const memoryOptions: ComponentOption[] = [
  { articleNumber: '14741', description: 'MEMS DDR5 6400 ECC Reg. 16GB | Micron | 1R x8', category: 'Memory' },
  { articleNumber: '14708', description: 'MEMS DDR5 6400 ECC Reg. 32GB | Micron | 2R x8', category: 'Memory' },
  { articleNumber: '14709', description: 'MEMS DDR5 6400 ECC Reg. 64GB | Micron | 2R x4', category: 'Memory' },
  { articleNumber: '14720', description: 'MEMS DDR5 6400 ECC Reg. 96GB | Micron | 6G x4', category: 'Memory' },
  { articleNumber: '14742', description: 'MEMS DDR5 6400 ECC Reg. 128GB | Micron | 2R x4', category: 'Memory' },
];

// Storage options from Excel Listen sheet
export const storageOptions: ComponentOption[] = [
  { articleNumber: '19358', description: 'NVMe Enterprise | 2.5" | Huawei eKitStor Xtreme 300P PCIe 5.0 | 3.84TB | 1 DWPD', category: 'Storage' },
  { articleNumber: '19357', description: 'NVMe Enterprise | 2.5" | Huawei eKitStor Xtreme 300P PCIe 5.0 | 7.68TB | 1 DWPD', category: 'Storage' },
  { articleNumber: '19359', description: 'NVMe Enterprise | 2.5" | Huawei eKitStor Xtreme 300P PCIe 5.0 | 15.36TB | 1 DWPD', category: 'Storage' },
  { articleNumber: '19390', description: 'NVMe Enterprise | 2.5" | Huawei eKitStor Xtreme 300P PCIe 5.0 | 30.72TB | 1 DWPD', category: 'Storage' },
  { articleNumber: '19371', description: 'NVMe Enterprise | 2.5" | Huawei eKitStor Xtreme 300P PCIe 5.0 | 3.2TB | 3 DWPD', category: 'Storage' },
  { articleNumber: '19372', description: 'NVMe Enterprise | 2.5" | Huawei eKitStor Xtreme 300P PCIe 5.0 | 6.4TB | 3 DWPD', category: 'Storage' },
  { articleNumber: '19388', description: 'NVMe Enterprise | 2.5" | Huawei eKitStor Xtreme 300P PCIe 5.0 | 12.8TB | 3 DWPD', category: 'Storage' },
  { articleNumber: '19401', description: 'NVMe Enterprise | 2.5" | Kioxia CD8P-R SIE | 3.84TB | 1 DWPD', category: 'Storage' },
  { articleNumber: '19321', description: 'NVMe Enterprise | 2.5" | Kioxia CD8P-R SIE | 7.68TB | 1 DWPD', category: 'Storage' },
  { articleNumber: '19322', description: 'NVMe Enterprise | 2.5" | Kioxia CD8P-R SIE | 15.36TB | 1 DWPD', category: 'Storage' },
  { articleNumber: '19323', description: 'NVMe Enterprise | 2.5" | Kioxia CD8P-R SIE | 30.72TB | 1 DWPD', category: 'Storage' },
  { articleNumber: '19320', description: 'NVMe Enterprise | 2.5" | Kioxia CD8P-V SIE | 6.4TB | 3 DWPD', category: 'Storage' },
  { articleNumber: '19324', description: 'NVMe Enterprise | 2.5" | Kioxia CD8P-V SIE | 12.8TB | 3 DWPD', category: 'Storage' },
];

// Application options from Excel Listen sheet
export const applicationOptions: ComponentOption[] = [
  { articleNumber: '99476', description: 'Fertigung - primeLine Golden Series | Clusternode | Azure Local', category: 'Anwendung' },
  { articleNumber: '99477', description: 'Fertigung - primeLine Golden Series | Clusternode | Proxmox', category: 'Anwendung' },
  { articleNumber: '99465', description: 'Fertigung - primeLine Golden Series | Clusternode | S2D', category: 'Anwendung' },
];

// Service options from Excel Listen sheet
export const serviceOptions: ComponentOption[] = [
  { articleNumber: '99466', description: 'Service - primeLine Golden Series | 36M Komponenten Vorabaustausch', category: 'Service' },
  { articleNumber: '99478', description: 'Service - primeLine Golden Series | 36 Monate vor Ort | NBD', category: 'Service' },
  { articleNumber: '99479', description: 'Service - primeLine Golden Series | 48 Monate vor Ort | NBD', category: 'Service' },
  { articleNumber: '99480', description: 'Service - primeLine Golden Series | 60 Monate vor Ort | NBD', category: 'Service' },
];

// Cable options (QSFP28 DAC) from Excel Listen sheet
export const cableOptions: ComponentOption[] = [
  { articleNumber: '91821', description: 'K-NET | 100Gb | pL | QSFP28 DAC | 0.5m', category: 'Kabel' },
  { articleNumber: '91798', description: 'K-NET | 100Gb | pL | QSFP28 DAC | 2.0m', category: 'Kabel' },
];

// Transceiver options (SFP28 DAC/Optics) from Excel Listen sheet
export const transceiverOptions: ComponentOption[] = [
  { articleNumber: '91820', description: 'K-NET | 25Gb | pL | SFP28 DAC | 0.5m', category: 'Transceiver' },
  { articleNumber: '91797', description: 'K-NET | 25Gb | pL | SFP28 DAC | 2.0m', category: 'Transceiver' },
  { articleNumber: '91819', description: 'K-NET | 25Gb | pL | SFP28 DAC | 3.0m', category: 'Transceiver' },
  { articleNumber: '41466', description: 'NIC Transceiver pL SFP28 Modul | 25Gb | SR Optics', category: 'Transceiver' },
  { articleNumber: '41609', description: 'NIC Transceiver pL SFP28 Modul | 25Gb | LR Optics', category: 'Transceiver' },
];

// OCP 3.0 x16 slot options
export const ocpOptions: ComponentOption[] = [
  { articleNumber: 'frei', description: 'frei (nicht belegt)', category: 'OCP' },
  { articleNumber: '41155', description: 'NIC Server 100Gbit Dual-Port | Intel E810-CQDA2OCPV3 | OCP 3.0', category: 'OCP' },
];

// PCIe Slot 1 x16 FH/FL options
export const pcieSlot1Options: ComponentOption[] = [
  { articleNumber: 'frei', description: 'frei (nicht belegt)', category: 'PCIe' },
  { articleNumber: '41151', description: 'NIC Server 100Gbit Dual-Port | Intel E810-CQDA2 | PCIe4.0 x16', category: 'PCIe' },
];

// PCIe Slot 2 x8 HH/HL options
export const pcieSlot2Options: ComponentOption[] = [
  { articleNumber: 'frei', description: 'frei (nicht belegt)', category: 'PCIe' },
  { articleNumber: '27458', description: 'Raid Broadcom - MegaRAID 9520-8i | Tri-Mode | PCIe 4.0', category: 'PCIe' },
];

// PCIe Slot 3 x16 HH/HL options
export const pcieSlot3Options: ComponentOption[] = [
  { articleNumber: 'frei', description: 'frei (nicht belegt)', category: 'PCIe' },
  { articleNumber: '40745', description: 'NIC Server 25Gbit Dual-Port | Broadcom NetXtreme P225p', category: 'PCIe' },
];

// Boot SSD options (selectable dropdown)
export const bootSsdOptions: ComponentOption[] = [
  { articleNumber: '19393', description: 'SSD Enterprise 2.5" SATA | Kingston DC600M | 960GB | 1.0 DWPD', category: 'Boot SSD' },
  { articleNumber: '19413', description: 'SSD Enterprise 2.5" SATA | Kingston DC600M | 480GB | 1.0 DWPD', category: 'Boot SSD' },
];

// TPM (fixed component)
export const tpmComponent: ComponentOption = {
  articleNumber: '31891', description: 'Zub ASUS Server | TPM 2.0 | TPM-SPI | E12 / E13', category: 'TPM'
};

// Legacy alias for backward compatibility
export const fixedComponents = {
  raidController: pcieSlot2Options[1],
  nic: pcieSlot3Options[1],
  bootSsd: bootSsdOptions[0],
  tpm: tpmComponent,
};

// Kept for backward compatibility - old name
export const pcieSlotOptions = pcieSlot1Options;

// All components combined for price management
export const allComponents: ComponentOption[] = [
  ...cpuOptions,
  ...memoryOptions,
  ...storageOptions,
  ...applicationOptions,
  ...serviceOptions,
  ...cableOptions,
  ...transceiverOptions,
  // OCP options (excluding 'frei')
  ...ocpOptions.filter(o => o.articleNumber !== 'frei'),
  // PCIe slot options (excluding 'frei' and deduplicating)
  ...pcieSlot1Options.filter(o => o.articleNumber !== 'frei'),
  ...pcieSlot2Options.filter(o => o.articleNumber !== 'frei'),
  ...pcieSlot3Options.filter(o => o.articleNumber !== 'frei'),
  // Boot SSD options
  ...bootSsdOptions,
  // TPM
  tpmComponent,
];

// Helper to find component by article number
export function findComponent(articleNumber: string): ComponentOption | undefined {
  return allComponents.find(c => c.articleNumber === articleNumber);
}

// Helper to get description for article number
export function getDescription(articleNumber: string): string {
  const component = findComponent(articleNumber);
  return component?.description ?? articleNumber;
}
