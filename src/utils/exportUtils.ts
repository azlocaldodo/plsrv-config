import { ServerConfiguration } from '../context/types';
import { calculateBom, calculateNodeTotal, calculateGrandTotal } from './bomCalculator';

// Export configuration as JSON
export function exportAsJson(config: ServerConfiguration, getPrice: (articleNumber: string) => number): string {
  const bomItems = calculateBom(config, getPrice);
  const nodeTotal = calculateNodeTotal(bomItems);
  const grandTotal = calculateGrandTotal(bomItems, config.nodeCount);

  const exportData = {
    configuration: config,
    bom: bomItems,
    summary: {
      nodeTotal,
      nodeCount: config.nodeCount,
      grandTotal,
      currency: 'EUR',
    },
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(exportData, null, 2);
}

// Download JSON file
export function downloadJson(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export as PDF using jsPDF
export async function exportAsPdf(config: ServerConfiguration, getPrice: (articleNumber: string) => number): Promise<void> {
  // Dynamic import for jsPDF
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const bomItems = calculateBom(config, getPrice);
  const nodeTotal = calculateNodeTotal(bomItems);
  const grandTotal = calculateGrandTotal(bomItems, config.nodeCount);

  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text('primeLine Server Configurator', 14, 22);
  doc.setFontSize(12);
  doc.text(`Model: ${config.modelId}`, 14, 32);
  doc.text(`Generated: ${new Date().toLocaleDateString('de-DE')}`, 14, 40);

  // BOM Table
  const tableData = bomItems.map((item) => [
    item.category,
    item.articleNumber,
    item.description.substring(0, 40) + (item.description.length > 40 ? '...' : ''),
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    formatCurrency(item.totalPrice),
  ]);

  autoTable(doc, {
    head: [['Category', 'Article', 'Description', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20 },
      2: { cellWidth: 60 },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' },
    },
  });

  // Summary
  const finalY = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text(`Subtotal per Node: ${formatCurrency(nodeTotal)}`, 14, finalY);
  doc.text(`Number of Nodes: ${config.nodeCount}`, 14, finalY + 8);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: ${formatCurrency(grandTotal)}`, 14, finalY + 18);

  // Save
  doc.save(`server-config-${config.modelId}-${new Date().toISOString().split('T')[0]}.pdf`);
}

function formatCurrency(amount: number): string {
  if (amount === 0) return '--';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}