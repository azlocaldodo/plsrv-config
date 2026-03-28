import { ServerConfiguration, BomItem } from '../context/types';
import { findComponent, tpmComponent } from '../data/components';

// Calculate BOM items from configuration
export function calculateBom(config: ServerConfiguration, getPrice: (articleNumber: string) => number): BomItem[] {
  const items: BomItem[] = [];

  // Helper to add BOM item
  const addItem = (category: string, articleNumber: string, quantity: number) => {
    const component = findComponent(articleNumber);
    const unitPrice = getPrice(articleNumber);
    items.push({
      category,
      articleNumber,
      description: component?.description ?? articleNumber,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    });
  };

  // CPU (1 per node)
  addItem('CPU', config.cpu, 1);

  // Memory
  addItem('Memory', config.memory.type, config.memory.quantity);

  // Storage
  addItem('Storage', config.storage.type, config.storage.quantity);

  // Application
  addItem('Anwendung', config.application, 1);

  // OCP 3.0 x16 Slot (0 if "frei", 1 if populated)
  if (config.pcieSlots.ocp !== 'frei') {
    addItem('OCP 3.0 x16', config.pcieSlots.ocp, 1);
  }

  // PCIe Slot 1 x16 FH/FL (0 if "frei", 1 if populated)
  if (config.pcieSlots.slot1 !== 'frei') {
    addItem('PCIe 1 x16 FH/FL', config.pcieSlots.slot1, 1);
  }

  // PCIe Slot 2 x8 HH/HL (0 if "frei", 1 if populated)
  if (config.pcieSlots.slot2 !== 'frei') {
    addItem('PCIe 2 x8 HH/HL', config.pcieSlots.slot2, 1);
  }

  // PCIe Slot 3 x16 HH/HL (0 if "frei", 1 if populated)
  if (config.pcieSlots.slot3 !== 'frei') {
    addItem('PCIe 3 x16 HH/HL', config.pcieSlots.slot3, 1);
  }

  // Boot SSD (selectable, quantity 2)
  addItem('Boot SSD', config.bootSsd, 2);

  // TPM (fixed)
  addItem('TPM', tpmComponent.articleNumber, 1);

  // Service
  addItem('Service', config.service, 1);

  // DAC Cable - calculated: (OCP count + PCIe1 count) * 2
  const ocpCount = config.pcieSlots.ocp !== 'frei' ? 1 : 0;
  const pcie1Count = config.pcieSlots.slot1 !== 'frei' ? 1 : 0;
  const dacCableQty = (ocpCount + pcie1Count) * 2;
  if (dacCableQty > 0) {
    addItem('DAC Kabel', config.network.cable, dacCableQty);
  }

  // Transceiver
  addItem('Transceiver', config.network.transceiver, config.network.transceiverQty);

  return items;
}

// Calculate total price for a single node
export function calculateNodeTotal(items: BomItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

// Calculate grand total (node total * node count)
export function calculateGrandTotal(items: BomItem[], nodeCount: number): number {
  return calculateNodeTotal(items) * nodeCount;
}

// Format price as EUR
export function formatPrice(price: number, currency: string = 'EUR'): string {
  if (price === 0) {
    return '--';
  }
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// Format article number
export function formatArticleNumber(articleNumber: string): string {
  return articleNumber;
}
