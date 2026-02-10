import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface GenerationControlsProps {
  onGenerate: (category: string, seed: number, variation: number, creativeFreedom: boolean, description: string) => void;
  generating: boolean;
}

export default function GenerationControls({ onGenerate, generating }: GenerationControlsProps) {
  const [category, setCategory] = useState('material');
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  const [variation, setVariation] = useState(50);
  const [creativeFreedom, setCreativeFreedom] = useState(false);
  const [description, setDescription] = useState('');

  const handleGenerate = () => {
    onGenerate(category, seed, variation, creativeFreedom, description);
  };

  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="skin">Skin/Organic</SelectItem>
            <SelectItem value="metal">Metal</SelectItem>
            <SelectItem value="stone">Stone</SelectItem>
            <SelectItem value="wood">Wood</SelectItem>
            <SelectItem value="fabric">Fabric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the texture you want to create..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="seed">Seed</Label>
          <Button variant="ghost" size="sm" onClick={randomizeSeed} disabled={generating}>
            Randomize
          </Button>
        </div>
        <Input
          id="seed"
          type="number"
          value={seed}
          onChange={(e) => setSeed(Number(e.target.value))}
          disabled={generating}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Variation</Label>
          <span className="text-sm text-muted-foreground">{variation}%</span>
        </div>
        <Slider
          value={[variation]}
          onValueChange={([v]) => setVariation(v)}
          min={0}
          max={100}
          step={1}
          disabled={generating}
        />
      </div>

      <Separator />

      <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <Label htmlFor="creative-freedom" className="cursor-pointer font-semibold">
              Creative Freedom-B
            </Label>
          </div>
          <Switch
            id="creative-freedom"
            checked={creativeFreedom}
            onCheckedChange={setCreativeFreedom}
            disabled={generating}
          />
        </div>
        {creativeFreedom && (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="flex items-center justify-between">
              <span>Temperature:</span>
              <span className="font-mono font-medium">1.5</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Top-P:</span>
              <span className="font-mono font-medium">0.90</span>
            </p>
            <p className="mt-2 text-[11px]">
              Enables more creative and diverse outputs with increased variability
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
        <p className="font-medium">Resolution: 3840 × 2160 (4K)</p>
        <p className="mt-1">All outputs are seamless and tileable</p>
      </div>

      <Button onClick={handleGenerate} disabled={generating} className="w-full" size="lg">
        {generating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Texture'
        )}
      </Button>
    </div>
  );
}
