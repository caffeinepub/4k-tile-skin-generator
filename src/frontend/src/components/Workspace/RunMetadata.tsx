import { Badge } from '@/components/ui/badge';
import { Calendar, Hash, Sparkles } from 'lucide-react';
import type { GenerationRun } from '../../types/generation';

interface RunMetadataProps {
  run: GenerationRun;
}

export default function RunMetadata({ run }: RunMetadataProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Badge variant="outline" className="gap-1.5">
        <Hash className="h-3 w-3" />
        Run {run.runId}
      </Badge>
      <Badge variant="outline" className="gap-1.5">
        <Calendar className="h-3 w-3" />
        {new Date(run.timestamp).toLocaleString()}
      </Badge>
      <Badge variant="outline">
        {run.category}
      </Badge>
      <Badge variant="outline">
        Seed: {run.seed}
      </Badge>
      {run.creativeFreedom && (
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="h-3 w-3" />
          Creative Freedom-B (T=1.5, P=0.90)
        </Badge>
      )}
      <Badge variant="outline" className="bg-primary/10">
        3840 × 2160 (4K)
      </Badge>
    </div>
  );
}
