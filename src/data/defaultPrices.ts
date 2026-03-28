import { PriceMap } from '../context/types';

// Default placeholder prices (all 0.00 - to be set by admin)
// Prices are in EUR
export const defaultPrices: PriceMap = {
  // CPU
  '130651': 0,
  '130652': 0,
  '130653': 0,
  '130654': 0,
  '130657': 0,
  '130685': 0,
  '130658': 0,
  '130662': 0,
  
  // Memory
  '14741': 0,
  '14708': 0,
  '14709': 0,
  '14720': 0,
  '14742': 0,
  
  // Storage
  '19358': 0,
  '19357': 0,
  '19359': 0,
  '19390': 0,
  '19371': 0,
  '19372': 0,
  '19388': 0,
  '19401': 0,
  '19321': 0,
  '19322': 0,
  '19323': 0,
  '19320': 0,
  '19324': 0,
  
  // Application
  '99476': 0,
  '99477': 0,
  '99465': 0,
  
  // Service
  '99466': 0,
  '99478': 0,
  '99479': 0,
  '99480': 0,
  
  // Cables
  '91821': 0,
  '91798': 0,
  
  // Transceivers
  '91820': 0,
  '91797': 0,
  '91819': 0,
  '41466': 0,
  '41609': 0,
  
  // OCP NIC
  '41155': 0,  // NIC Server 100Gbit Dual-Port | Intel E810-CQDA2OCPV3 | OCP 3.0
  
  // PCIe NICs / Controllers
  '41151': 0,  // NIC Server 100Gbit Dual-Port | Intel E810-CQDA2 | PCIe4.0 x16
  '27458': 0,  // Raid Broadcom - MegaRAID 9520-8i | Tri-Mode | PCIe 4.0
  '40745': 0,  // NIC Server 25Gbit Dual-Port | Broadcom NetXtreme P225p
  
  // Boot SSD
  '19393': 0,  // SSD Enterprise 2.5" SATA | Kingston DC600M | 960GB | 1.0 DWPD
  '19413': 0,  // SSD Enterprise 2.5" SATA | Kingston DC600M | 480GB | 1.0 DWPD
  
  // TPM
  '31891': 0,  // Zub ASUS Server | TPM 2.0 | TPM-SPI | E12 / E13
};

// localStorage key for prices
export const PRICES_STORAGE_KEY = 'primeline-configurator-prices';

// Admin PIN (stored in localStorage)
export const ADMIN_PIN_KEY = 'primeline-configurator-admin-pin';
export const DEFAULT_ADMIN_PIN = '1234';
