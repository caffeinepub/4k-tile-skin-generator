import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import type { GenerationRun } from '../../types/generation';
import { exportSingleMap, exportAllMapsAsZip } from '../../lib/export/exportMaps';

interface ExportPanelProps {
  run: GenerationRun;
}

const mapLabels = [
  { key: 'albedo' as const, label: 'Albedo' },
  { key: 'normal' as const, label: 'Normal' },
  { key: 'roughness' as const, label: 'Roughness' },
  { key: 'fluid' as const, label: 'Fluid' },
  { key: 'metallic' as const, label: 'Metallic' },
];

export default function ExportPanel({ run }: ExportPanelProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExportMap = async (mapKey: keyof typeof run.maps, format: 'png' | 'jpg') => {
    setExporting(`${mapKey}-${format}`);
    try {
      await exportSingleMap(run.maps[mapKey], `${mapKey}-${run.runId}`, format);
      toast.success(`${mapKey} map exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExporting(null);
    }
  };

  const handleExportAll = async () => {
    setExporting('all');
    try {
      await exportAllMapsAsZip(run.maps, `texture-${run.runId}`);
      toast.success('All maps downloaded');
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {mapLabels.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium">{label}</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExportMap(key, 'png')}
                disabled={exporting !== null}
              >
                {exporting === `${key}-png` ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'PNG'
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExportMap(key, 'jpg')}
                disabled={exporting !== null}
              >
                {exporting === `${key}-jpg` ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'JPG'
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleExportAll}
        disabled={exporting !== null}
        className="w-full"
        size="lg"
      >
        {exporting === 'all' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Package className="mr-2 h-4 w-4" />
            Download All Maps
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        TIFF export is not available in the browser. Use PNG for lossless quality. All maps download individually.
      </p>
    </div>
  );
}
