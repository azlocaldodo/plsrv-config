import { Fragment, useMemo, useState, type ChangeEvent } from 'react';
import { usePrices } from '../context/PriceContext';
import { useConfigurator } from '../context/ConfiguratorContext';
import { defaultModelImages, useServerImages } from '../context/ServerImageContext';
import { allComponents } from '../data/components';
import { getModelById } from '../data/serverModels';
import { DEFAULT_ADMIN_PIN, ADMIN_PIN_KEY } from '../data/defaultPrices';
import { formatPrice } from '../utils/bomCalculator';
import { Save, Download, Upload, LogOut, Lock, SlidersHorizontal, RefreshCw, ImagePlus, RotateCcw } from 'lucide-react';
import Card from '../components/UI/Card';

type AdjustmentMode = 'percent' | 'fixed' | 'set';

export default function AdminPage() {
  const { priceState, priceDispatch, getPrice, hasPrice } = usePrices();
  const { configuration } = useConfigurator();
  const { getModelImages, setModelImages, resetModelImages } = useServerImages();
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('adminAuth') === 'true');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [manualPrices, setManualPrices] = useState<Record<string, string>>({});

  const [adjustmentMode, setAdjustmentMode] = useState<AdjustmentMode>('percent');
  const [adjustmentValue, setAdjustmentValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const modelId = configuration.modelId;
  const model = getModelById(modelId);
  const modelImages = getModelImages(modelId);
  const [frontImageUrl, setFrontImageUrl] = useState(modelImages.front);
  const [rearImageUrl, setRearImageUrl] = useState(modelImages.rear);
  const [frontPreviewFailed, setFrontPreviewFailed] = useState(false);
  const [rearPreviewFailed, setRearPreviewFailed] = useState(false);

  const getStoredPin = () => localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_ADMIN_PIN;

  const handleLogin = () => {
    if (pin === getStoredPin()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setPinError('');
      return;
    }
    setPinError('Invalid PIN');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  const categories = useMemo(() => {
    return Array.from(new Set(allComponents.map((component) => component.category))).sort();
  }, []);

  const filteredComponents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allComponents.filter((component) => {
      const bySearch =
        !term ||
        component.articleNumber.toLowerCase().includes(term) ||
        component.description.toLowerCase().includes(term) ||
        component.category.toLowerCase().includes(term);
      const byCategory = selectedCategory === 'ALL' || component.category === selectedCategory;
      return bySearch && byCategory;
    });
  }, [searchTerm, selectedCategory]);

  const groupedComponents = useMemo(() => {
    const groups: Record<string, typeof allComponents> = {};
    filteredComponents.forEach((component) => {
      if (!groups[component.category]) {
        groups[component.category] = [];
      }
      groups[component.category].push(component);
    });
    return groups;
  }, [filteredComponents]);

  const getDraftPrice = (articleNumber: string) => {
    return manualPrices[articleNumber] ?? getPrice(articleNumber).toString();
  };

  const handleDraftChange = (articleNumber: string, value: string) => {
    setManualPrices((prev) => ({ ...prev, [articleNumber]: value }));
  };

  const handleManualSave = (articleNumber: string) => {
    const parsed = parseFloat(getDraftPrice(articleNumber));
    if (Number.isNaN(parsed) || parsed < 0) {
      setStatusMessage('Please enter a valid non-negative price.');
      return;
    }

    const nextPrice = Number(parsed.toFixed(2));
    priceDispatch({ type: 'SET_PRICE', payload: { articleNumber, price: nextPrice } });
    setManualPrices((prev) => ({ ...prev, [articleNumber]: nextPrice.toString() }));
    setStatusMessage(`Saved ${articleNumber} -> ${formatPrice(nextPrice, priceState.currency)}`);
  };

  const handleSaveVisible = () => {
    const updates: Record<string, number> = {};

    filteredComponents.forEach((component) => {
      const raw = manualPrices[component.articleNumber];
      if (raw === undefined) return;
      const parsed = parseFloat(raw);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        updates[component.articleNumber] = Number(parsed.toFixed(2));
      }
    });

    if (Object.keys(updates).length === 0) {
      setStatusMessage('No valid manual changes to save.');
      return;
    }

    priceDispatch({ type: 'IMPORT_PRICES', payload: updates });
    setStatusMessage(`Saved ${Object.keys(updates).length} visible price updates.`);
  };

  const handleBulkAdjust = () => {
    const parsed = parseFloat(adjustmentValue);
    if (Number.isNaN(parsed)) {
      setStatusMessage('Please provide a valid adjustment value.');
      return;
    }

    const updates: Record<string, number> = {};
    filteredComponents.forEach((component) => {
      const current = getPrice(component.articleNumber);
      let next = current;

      if (adjustmentMode === 'percent') {
        next = current * (1 + parsed / 100);
      } else if (adjustmentMode === 'fixed') {
        next = current + parsed;
      } else {
        next = parsed;
      }

      updates[component.articleNumber] = Number(Math.max(0, next).toFixed(2));
    });

    if (Object.keys(updates).length === 0) {
      setStatusMessage('No matching components for this operation.');
      return;
    }

    priceDispatch({ type: 'IMPORT_PRICES', payload: updates });
    setManualPrices((prev) => {
      const merged = { ...prev };
      Object.entries(updates).forEach(([articleNumber, price]) => {
        merged[articleNumber] = price.toString();
      });
      return merged;
    });

    setStatusMessage(`Applied ${adjustmentMode} adjustment to ${Object.keys(updates).length} items.`);
  };

  const handleExportCsv = () => {
    const csvContent =
      'ArticleNumber,Description,Price\n' +
      allComponents
        .map((component) => `${component.articleNumber},"${component.description}",${getPrice(component.articleNumber)}`)
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `primeline-prices-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportCsv = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadedEvent) => {
      try {
        const text = loadedEvent.target?.result as string;
        const lines = text.split('\n').slice(1);
        const newPrices: Record<string, number> = {};

        lines.forEach((line) => {
          const parts = line.split(',');
          if (parts.length < 3) return;

          const articleNumber = parts[0].trim();
          const price = parseFloat(parts[parts.length - 1].trim());
          if (!articleNumber || Number.isNaN(price)) return;

          newPrices[articleNumber] = Number(Math.max(0, price).toFixed(2));
        });

        priceDispatch({ type: 'IMPORT_PRICES', payload: newPrices });
        setStatusMessage(`Imported ${Object.keys(newPrices).length} prices from CSV.`);
      } catch {
        setStatusMessage('Failed to parse CSV file.');
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const handleImageUrlSave = () => {
    setFrontPreviewFailed(false);
    setRearPreviewFailed(false);
    setModelImages(modelId, {
      front: frontImageUrl.trim(),
      rear: rearImageUrl.trim(),
    });
    setStatusMessage('Server image URLs saved.');
  };

  const handleImageFileUpload = (type: 'front' | 'rear', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = (loadEvent.target?.result as string) || '';
      if (!dataUrl) return;

      const next = {
        front: type === 'front' ? dataUrl : frontImageUrl,
        rear: type === 'rear' ? dataUrl : rearImageUrl,
      };

      if (type === 'front') {
        setFrontPreviewFailed(false);
      } else {
        setRearPreviewFailed(false);
      }

      setFrontImageUrl(next.front);
      setRearImageUrl(next.rear);
      setModelImages(modelId, next);
      setStatusMessage(`${type === 'front' ? 'Front' : 'Rear'} image uploaded and saved.`);
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleImageReset = () => {
    resetModelImages(modelId);
    const defaults = defaultModelImages[modelId] || { front: '', rear: '' };
    setFrontImageUrl(defaults.front);
    setRearImageUrl(defaults.rear);
    setFrontPreviewFailed(false);
    setRearPreviewFailed(false);
    setStatusMessage('Server images reset to default values.');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/15 rounded-full mb-4 border border-themed">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-themed">Admin Access</h2>
            <p className="text-themed-secondary text-sm mt-2">Enter PIN to access price management</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
              placeholder="Enter PIN"
              className="w-full rounded-xl px-4 py-3 text-themed text-center text-lg tracking-widest"
            />
            {pinError && <p className="text-red-400 text-sm text-center">{pinError}</p>}
            <button onClick={handleLogin} className="w-full bg-accent text-white py-3 rounded-xl hover:opacity-90 transition-colors">
              Login
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-themed">Admin Price Studio</h2>
          <p className="text-themed-secondary text-sm mt-1">
            Last updated: {new Date(priceState.lastUpdated).toLocaleString('de-DE')}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-themed-btn border border-themed text-themed rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <ImagePlus className="w-5 h-5 text-accent" />
          <h3 className="text-themed font-semibold">Server Images</h3>
          <span className="chip">{model?.name || modelId}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <figure className="rounded-2xl border border-themed p-3 bg-themed-card">
            <figcaption className="text-xs uppercase tracking-wide text-themed-secondary mb-2">Front Preview</figcaption>
            {frontImageUrl && !frontPreviewFailed ? (
              <img
                src={frontImageUrl}
                alt="Server front preview"
                className="w-full h-40 object-cover rounded-xl"
                loading="lazy"
                onError={() => setFrontPreviewFailed(true)}
              />
            ) : (
              <div className="w-full h-40 rounded-xl bg-themed-btn border border-themed flex items-center justify-center text-themed-secondary text-sm">
                No front image set
              </div>
            )}
          </figure>
          <figure className="rounded-2xl border border-themed p-3 bg-themed-card">
            <figcaption className="text-xs uppercase tracking-wide text-themed-secondary mb-2">Rear Preview</figcaption>
            {rearImageUrl && !rearPreviewFailed ? (
              <img
                src={rearImageUrl}
                alt="Server rear preview"
                className="w-full h-40 object-cover rounded-xl"
                loading="lazy"
                onError={() => setRearPreviewFailed(true)}
              />
            ) : (
              <div className="w-full h-40 rounded-xl bg-themed-btn border border-themed flex items-center justify-center text-themed-secondary text-sm">
                No rear image set
              </div>
            )}
          </figure>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs uppercase tracking-wide text-themed-secondary">Front Image URL</label>
            <input
              type="url"
              value={frontImageUrl}
              onChange={(event) => setFrontImageUrl(event.target.value)}
              placeholder="https://... or /server-front.svg"
              className="w-full rounded-xl px-3 py-2.5 mt-2"
            />
            <label className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-themed-btn border border-themed rounded-lg cursor-pointer text-sm text-themed-secondary">
              <Upload className="w-4 h-4" />
              Upload Front Image
              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImageFileUpload('front', event)} />
            </label>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-themed-secondary">Rear Image URL</label>
            <input
              type="url"
              value={rearImageUrl}
              onChange={(event) => setRearImageUrl(event.target.value)}
              placeholder="https://... or /server-rear.svg"
              className="w-full rounded-xl px-3 py-2.5 mt-2"
            />
            <label className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-themed-btn border border-themed rounded-lg cursor-pointer text-sm text-themed-secondary">
              <Upload className="w-4 h-4" />
              Upload Rear Image
              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImageFileUpload('rear', event)} />
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={handleImageUrlSave}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl hover:opacity-90 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Image URLs
          </button>
          <button
            onClick={handleImageReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-themed-btn border border-themed text-themed rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <label className="text-xs uppercase tracking-wide text-themed-secondary">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Article, description or category"
              className="w-full rounded-xl px-3 py-2.5 mt-2"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-themed-secondary">Category Filter</label>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-xl px-3 py-2.5 mt-2"
            >
              <option value="ALL">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleSaveVisible}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl hover:opacity-90 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Visible
            </button>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleExportCsv}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-themed-btn border border-themed text-themed rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-themed-btn border border-themed text-themed rounded-xl transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Import CSV
              <input type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
            </label>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-accent" />
          <h3 className="text-themed font-semibold">Quick Price Tools</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs uppercase tracking-wide text-themed-secondary">Mode</label>
            <select
              value={adjustmentMode}
              onChange={(event) => setAdjustmentMode(event.target.value as AdjustmentMode)}
              className="w-full rounded-xl px-3 py-2.5 mt-2"
            >
              <option value="percent">Percent (+/- %)</option>
              <option value="fixed">Fixed amount (+/- EUR)</option>
              <option value="set">Set exact price (EUR)</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-themed-secondary">Value</label>
            <input
              type="number"
              value={adjustmentValue}
              onChange={(event) => setAdjustmentValue(event.target.value)}
              placeholder={adjustmentMode === 'percent' ? 'e.g. 4.5' : 'e.g. 25'}
              className="w-full rounded-xl px-3 py-2.5 mt-2"
            />
          </div>
          <div className="md:col-span-2 flex items-end gap-2">
            <button
              onClick={handleBulkAdjust}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl hover:opacity-90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Apply to Visible Items
            </button>
          </div>
        </div>
        <p className="text-xs text-themed-secondary mt-3">
          Visible items are affected by search and category filters. Manual values are always clamped to 0 EUR minimum.
        </p>
      </Card>

      {statusMessage && (
        <div className="rounded-xl border border-themed bg-themed-card px-4 py-3 text-sm text-themed-secondary">
          {statusMessage}
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="border-b border-themed">
                <th className="text-left py-3 px-4 text-themed-secondary font-medium">Category</th>
                <th className="text-left py-3 px-4 text-themed-secondary font-medium">Article</th>
                <th className="text-left py-3 px-4 text-themed-secondary font-medium">Description</th>
                <th className="text-right py-3 px-4 text-themed-secondary font-medium">Current</th>
                <th className="text-right py-3 px-4 text-themed-secondary font-medium">Manual</th>
                <th className="text-center py-3 px-4 text-themed-secondary font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedComponents).map(([category, components]) => (
                <Fragment key={category}>
                  <tr className="bg-themed-table-header">
                    <td colSpan={6} className="py-2 px-4 text-themed font-semibold">
                      {category}
                    </td>
                  </tr>
                  {components.map((component) => (
                    <tr
                      key={component.articleNumber}
                      className="border-b border-themed bg-themed-table-hover"
                      style={{ borderColor: 'color-mix(in srgb, var(--border) 50%, transparent)' }}
                    >
                      <td className="py-3 px-4 text-themed-muted">{component.category}</td>
                      <td className="py-3 px-4">
                        <span className="article-number">{component.articleNumber}</span>
                      </td>
                      <td className="py-3 px-4 text-themed text-sm">
                        {component.description.length > 78 ? `${component.description.slice(0, 78)}...` : component.description}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`price ${hasPrice(component.articleNumber) ? 'text-success' : 'text-themed-muted'}`}>
                          {formatPrice(getPrice(component.articleNumber), priceState.currency)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <input
                          type="number"
                          value={getDraftPrice(component.articleNumber)}
                          onChange={(event) => handleDraftChange(component.articleNumber, event.target.value)}
                          onKeyDown={(event) => event.key === 'Enter' && handleManualSave(component.articleNumber)}
                          className="w-28 rounded-lg px-2 py-1.5 text-right"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleManualSave(component.articleNumber)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
