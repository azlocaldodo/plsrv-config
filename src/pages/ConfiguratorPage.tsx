import { useEffect, useState } from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { usePrices } from '../context/PriceContext';
import { useServerImages } from '../context/ServerImageContext';
import { getModelById } from '../data/serverModels';
import { cpuOptions, memoryOptions, storageOptions, applicationOptions, serviceOptions, cableOptions, transceiverOptions, ocpOptions, pcieSlot1Options, pcieSlot2Options, pcieSlot3Options, bootSsdOptions } from '../data/components';
import { calculateBom, calculateNodeTotal, calculateGrandTotal, formatPrice } from '../utils/bomCalculator';
import { exportAsJson, exportAsPdf } from '../utils/exportUtils';
import Card from '../components/UI/Card';
import Select from '../components/UI/Select';
import QuantityInput from '../components/UI/QuantityInput';
import { FileJson, FileText } from 'lucide-react';

export default function ConfiguratorPage() {
  const { configuration, dispatch } = useConfigurator();
  const { getPrice, hasPrice, priceState } = usePrices();
  const { getModelImages } = useServerImages();
  const model = getModelById(configuration.modelId);
  const modelImages = getModelImages(configuration.modelId);
  const [frontLoadFailed, setFrontLoadFailed] = useState(false);
  const [rearLoadFailed, setRearLoadFailed] = useState(false);
  const bomItems = calculateBom(configuration, getPrice);
  const nodeTotal = calculateNodeTotal(bomItems);
  const grandTotal = calculateGrandTotal(bomItems, configuration.nodeCount);
  const missingPriceCount = bomItems.filter((item) => !hasPrice(item.articleNumber)).length;

  const handleExportJson = () => {
    const json = exportAsJson(configuration, getPrice);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `server-config-${configuration.modelId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    exportAsPdf(configuration, getPrice);
  };

  useEffect(() => {
    setFrontLoadFailed(false);
    setRearLoadFailed(false);
  }, [modelImages.front, modelImages.rear]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-themed">Build Your Server Stack</h2>
            <p className="text-themed-secondary mt-2">
              Configure hardware options, review live BOM totals, and export the result for procurement.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="chip">Model {model?.name}</span>
            <span className="chip">Nodes {configuration.nodeCount}</span>
            <span className="chip">Currency {priceState.currency}</span>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <h3 className="text-xl font-semibold text-themed">Server Visual Preview</h3>
            <p className="text-sm text-themed-secondary">Front and rear chassis images can be managed in Admin.</p>
          </div>
          <span className="chip">Model View</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <figure className="relative rounded-2xl border border-themed bg-themed-card p-3">
            <figcaption className="text-xs uppercase tracking-wide text-themed-secondary mb-2">Front</figcaption>
            {modelImages.front && !frontLoadFailed ? (
              <img
                src={modelImages.front}
                alt={`${model?.name || 'Server'} front view`}
                className="w-full h-40 md:h-48 object-cover rounded-xl"
                loading="lazy"
                onError={() => setFrontLoadFailed(true)}
              />
            ) : (
              <div className="w-full h-40 md:h-48 rounded-xl bg-themed-btn border border-themed flex items-center justify-center text-themed-secondary text-sm">
                No front image configured
              </div>
            )}
          </figure>

          <figure className="relative rounded-2xl border border-themed bg-themed-card p-3">
            <figcaption className="text-xs uppercase tracking-wide text-themed-secondary mb-2">Rear</figcaption>
            {modelImages.rear && !rearLoadFailed ? (
              <img
                src={modelImages.rear}
                alt={`${model?.name || 'Server'} rear view`}
                className="w-full h-40 md:h-48 object-cover rounded-xl"
                loading="lazy"
                onError={() => setRearLoadFailed(true)}
              />
            ) : (
              <div className="w-full h-40 md:h-48 rounded-xl bg-themed-btn border border-themed flex items-center justify-center text-themed-secondary text-sm">
                No rear image configured
              </div>
            )}
          </figure>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Configuration */}
      <div className="lg:col-span-2 space-y-6">
        {/* Server Info */}
        <Card title="Server Information">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-themed-secondary text-sm">Model</span>
              <p className="text-themed font-medium">{model?.name}</p>
            </div>
            <div>
              <span className="text-themed-secondary text-sm">Max Nodes</span>
              <p className="text-themed font-medium">{model?.maxNodes}</p>
            </div>
            <div>
              <span className="text-themed-secondary text-sm">GPU Support</span>
              <p className="text-themed font-medium">{model?.gpuSupport ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <span className="text-themed-secondary text-sm">NIC Onboard</span>
              <p className="text-themed font-medium">{model?.nicOnboard}</p>
            </div>
          </div>
        </Card>

        {/* Configuration */}
        <Card title="Configuration">
          <div className="space-y-4">
            {/* Application */}
            <div>
              <Select
                label="Application (Anwendung)"
                options={applicationOptions.map((a) => ({ value: a.articleNumber, label: a.description }))}
                value={configuration.application}
                onChange={(e) => dispatch({ type: 'SET_APPLICATION', payload: e.target.value })}
              />
            </div>

            {/* Node Count */}
            <div>
              <QuantityInput
                label="Number of Nodes"
                value={configuration.nodeCount}
                onChange={(value) => dispatch({ type: 'SET_NODE_COUNT', payload: value })}
                min={1}
                max={model?.maxNodes || 3}
              />
            </div>

            {/* CPU */}
            <div>
              <Select
                label="CPU"
                options={cpuOptions.map((c) => ({ value: c.articleNumber, label: c.description }))}
                value={configuration.cpu}
                onChange={(e) => dispatch({ type: 'SET_CPU', payload: e.target.value })}
              />
            </div>

            {/* Memory */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  label="Memory Type"
                  options={memoryOptions.map((m) => ({ value: m.articleNumber, label: m.description }))}
                  value={configuration.memory.type}
                  onChange={(e) => dispatch({ type: 'SET_MEMORY_TYPE', payload: e.target.value })}
                />
              </div>
              <div>
                <QuantityInput
                  label="Quantity"
                  value={configuration.memory.quantity}
                  onChange={(value) => dispatch({ type: 'SET_MEMORY_QUANTITY', payload: value })}
                  min={1}
                  max={model?.maxMemorySlots || 12}
                />
              </div>
            </div>

            {/* Storage */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  label="Storage Type"
                  options={storageOptions.map((s) => ({ value: s.articleNumber, label: s.description }))}
                  value={configuration.storage.type}
                  onChange={(e) => dispatch({ type: 'SET_STORAGE_TYPE', payload: e.target.value })}
                />
              </div>
              <div>
                <QuantityInput
                  label="Quantity"
                  value={configuration.storage.quantity}
                  onChange={(value) => dispatch({ type: 'SET_STORAGE_QUANTITY', payload: value })}
                  min={1}
                  max={model?.maxStorageDrives || 12}
                />
              </div>
            </div>

            {/* OCP 3.0 x16 Slot */}
            <div>
              <Select
                label="OCP 3.0 x16"
                options={ocpOptions.map((o) => ({ value: o.articleNumber, label: o.description }))}
                value={configuration.pcieSlots.ocp}
                onChange={(e) => dispatch({ type: 'SET_PCIE_OCP', payload: e.target.value })}
              />
            </div>

            {/* PCIe Slot 1 x16 FH/FL */}
            <div>
              <Select
                label="PCIe 1 x16 FH/FL"
                options={pcieSlot1Options.map((p) => ({ value: p.articleNumber, label: p.description }))}
                value={configuration.pcieSlots.slot1}
                onChange={(e) => dispatch({ type: 'SET_PCIE_SLOT1', payload: e.target.value })}
              />
            </div>

            {/* PCIe Slot 2 x8 HH/HL */}
            <div>
              <Select
                label="PCIe 2 x8 HH/HL"
                options={pcieSlot2Options.map((p) => ({ value: p.articleNumber, label: p.description }))}
                value={configuration.pcieSlots.slot2}
                onChange={(e) => dispatch({ type: 'SET_PCIE_SLOT2', payload: e.target.value })}
              />
            </div>

            {/* PCIe Slot 3 x16 HH/HL */}
            <div>
              <Select
                label="PCIe 3 x16 HH/HL"
                options={pcieSlot3Options.map((p) => ({ value: p.articleNumber, label: p.description }))}
                value={configuration.pcieSlots.slot3}
                onChange={(e) => dispatch({ type: 'SET_PCIE_SLOT3', payload: e.target.value })}
              />
            </div>

            {/* Boot SSD */}
            <div>
              <Select
                label="Boot SSD (2x)"
                options={bootSsdOptions.map((b) => ({ value: b.articleNumber, label: b.description }))}
                value={configuration.bootSsd}
                onChange={(e) => dispatch({ type: 'SET_BOOT_SSD', payload: e.target.value })}
              />
            </div>

            {/* Network */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  label="DAC Cable"
                  options={cableOptions.map((c) => ({ value: c.articleNumber, label: c.description }))}
                  value={configuration.network.cable}
                  onChange={(e) => dispatch({ type: 'SET_CABLE', payload: e.target.value })}
                />
              </div>
              <div>
                <Select
                  label="Transceiver"
                  options={transceiverOptions.map((t) => ({ value: t.articleNumber, label: t.description }))}
                  value={configuration.network.transceiver}
                  onChange={(e) => dispatch({ type: 'SET_TRANSCEIVER', payload: e.target.value })}
                />
              </div>
            </div>

            <div>
              <QuantityInput
                label="Transceiver Quantity"
                value={configuration.network.transceiverQty}
                onChange={(value) => dispatch({ type: 'SET_TRANSCEIVER_QTY', payload: value })}
                min={1}
                max={24}
              />
            </div>

            {/* Service */}
            <div>
              <Select
                label="Service Level"
                options={serviceOptions.map((s) => ({ value: s.articleNumber, label: s.description }))}
                value={configuration.service}
                onChange={(e) => dispatch({ type: 'SET_SERVICE', payload: e.target.value })}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column - BOM Summary */}
      <div className="space-y-6">
        <Card title="BOM Summary">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-themed">
                  <th className="text-left py-2 text-themed-secondary">Category</th>
                  <th className="text-left py-2 text-themed-secondary">Article</th>
                  <th className="text-center py-2 text-themed-secondary">Qty</th>
                  <th className="text-right py-2 text-themed-secondary">Price</th>
                </tr>
              </thead>
              <tbody>
                {bomItems.map((item, index) => (
                  <tr key={index} className="border-b border-themed" style={{ borderColor: 'color-mix(in srgb, var(--border) 50%, transparent)' }}>
                    <td className="py-2 text-themed-secondary">{item.category}</td>
                    <td className="py-2">
                      <span className="article-number">{item.articleNumber}</span>
                    </td>
                    <td className="py-2 text-center text-themed">{item.quantity}</td>
                    <td className="py-2 text-right">
                      {hasPrice(item.articleNumber) ? (
                        <span className="price text-accent-green">{formatPrice(item.totalPrice, priceState.currency)}</span>
                      ) : (
                        <span className="text-themed-muted">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-themed space-y-2">
            <div className="flex justify-between text-themed-secondary">
              <span>Subtotal per Node:</span>
              <span className="price">{formatPrice(nodeTotal, priceState.currency)}</span>
            </div>
            <div className="flex justify-between text-themed-secondary">
              <span>Number of Nodes:</span>
              <span>× {configuration.nodeCount}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-themed pt-2 border-t border-themed">
              <span>Grand Total:</span>
              <span className="price text-accent-green">{formatPrice(grandTotal, priceState.currency)}</span>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="mt-4 pt-4 border-t border-themed flex gap-2">
            <button
              onClick={handleExportJson}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-themed-btn text-themed rounded-lg transition-colors"
            >
              <FileJson className="w-4 h-4" />
              JSON
            </button>
            <button
              onClick={handleExportPdf}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-colors"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>
        </Card>

        {/* Price Warning */}
        {missingPriceCount > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-amber-400 text-sm">
              {missingPriceCount} items are missing a price. Go to Admin to configure prices.
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
