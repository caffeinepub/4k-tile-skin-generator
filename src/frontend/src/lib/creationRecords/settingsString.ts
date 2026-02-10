import type { GenerationRun, ReferenceImage } from '../../types/generation';

export function generateSettingsString(run: GenerationRun, references: ReferenceImage[]): string {
  const parts = [
    `Category: ${run.category}`,
    `Seed: ${run.seed}`,
    `Variation: ${run.variation}%`,
    `Creative Freedom-B: ${run.creativeFreedom ? 'Enabled (T=1.5, P=0.90)' : 'Disabled'}`,
    `References: ${references.length} image(s)`,
    `Resolution: 3840×2160 (4K)`,
  ];

  if (run.description) {
    parts.push(`Description: ${run.description}`);
  }

  return parts.join(' | ');
}
