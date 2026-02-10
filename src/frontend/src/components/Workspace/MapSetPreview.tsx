import { Badge } from '@/components/ui/badge';
import type { PBRMapSet } from '../../types/generation';

interface MapSetPreviewProps {
  maps: PBRMapSet;
}

const mapLabels = [
  { key: 'albedo' as const, label: 'Albedo', color: 'bg-chart-1' },
  { key: 'normal' as const, label: 'Normal', color: 'bg-chart-2' },
  { key: 'roughness' as const, label: 'Roughness', color: 'bg-chart-3' },
  { key: 'fluid' as const, label: 'Fluid', color: 'bg-chart-4' },
  { key: 'metallic' as const, label: 'Metallic', color: 'bg-chart-5' },
];

export default function MapSetPreview({ maps }: MapSetPreviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mapLabels.map(({ key, label, color }) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <span className="text-sm font-medium">{label}</span>
          </div>
          <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
            <img
              src={maps[key]}
              alt={`${label} map`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
