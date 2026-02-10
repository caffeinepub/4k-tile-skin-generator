import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import type { ReferenceImage } from '../../types/generation';
import { validateReferenceImage } from '../../lib/references/referenceValidation';

interface ReferenceGalleryProps {
  references: ReferenceImage[];
  onChange: (references: ReferenceImage[]) => void;
}

export default function ReferenceGallery({ references, onChange }: ReferenceGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      const validation = validateReferenceImage(file);
      if (!validation.valid) {
        toast.error(validation.error);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newRef: ReferenceImage = {
          id: `${Date.now()}-${Math.random()}`,
          url: event.target?.result as string,
          name: file.name,
        };
        onChange([...references, newRef]);
      };
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    onChange(references.filter((ref) => ref.id !== id));
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Reference Images
      </Button>

      {references.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {references.map((ref) => (
            <div key={ref.id} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <img
                src={ref.url}
                alt={ref.name}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => handleRemove(ref.id)}
                className="absolute right-2 top-2 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4 text-destructive-foreground" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No reference images uploaded
          </p>
        </div>
      )}
    </div>
  );
}
