import { Separator } from '@/components/ui/separator';
import { FileText, Image, Sparkles } from 'lucide-react';
import type { GenerationRun, ReferenceImage } from '../../types/generation';

interface RunCompositionProps {
  run: GenerationRun;
  references: ReferenceImage[];
}

export default function RunComposition({ run, references }: RunCompositionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            1
          </span>
          <FileText className="h-4 w-4" />
          Description (33.33%)
        </h3>
        <div className="ml-9 space-y-2">
          {run.description ? (
            <p className="text-sm text-muted-foreground">{run.description}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">No description provided</p>
          )}
          <div className="text-xs text-muted-foreground">
            <p>Category: <span className="font-medium">{run.category}</span></p>
            <p>Variation: <span className="font-medium">{run.variation}%</span></p>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            2
          </span>
          <Image className="h-4 w-4" />
          Reference Visuals (33.33%)
        </h3>
        <div className="ml-9">
          {references.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {references.map((ref) => (
                <div key={ref.id} className="aspect-square overflow-hidden rounded-md border">
                  <img src={ref.url} alt={ref.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reference images were used for this generation.</p>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            3
          </span>
          <Sparkles className="h-4 w-4" />
          Creative Freedom-B (33.33%)
        </h3>
        <div className="ml-9 space-y-2">
          {run.creativeFreedom ? (
            <>
              <p className="text-sm text-muted-foreground">
                Creative Freedom-B mode was enabled, increasing output diversity and creativity.
              </p>
              <div className="flex gap-3 text-xs">
                <div className="rounded-md bg-muted px-3 py-1.5">
                  <span className="font-medium">Temperature:</span> 1.5
                </div>
                <div className="rounded-md bg-muted px-3 py-1.5">
                  <span className="font-medium">Top-P:</span> 0.90
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Creative Freedom-B mode was not enabled for this generation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
