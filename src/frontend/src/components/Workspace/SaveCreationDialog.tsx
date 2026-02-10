import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSaveCreationRecord } from '../../hooks/useQueries';
import type { GenerationRun, ReferenceImage } from '../../types/generation';
import { generateSettingsString } from '../../lib/creationRecords/settingsString';
import { generateThumbnail } from '../../lib/creationRecords/thumbnail';

interface SaveCreationDialogProps {
  run: GenerationRun;
  references: ReferenceImage[];
}

export default function SaveCreationDialog({ run, references }: SaveCreationDialogProps) {
  const { identity } = useInternetIdentity();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [markedUsable, setMarkedUsable] = useState(false);
  const saveRecordMutation = useSaveCreationRecord();

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!markedUsable) {
      toast.error('Please mark this creation as usable before saving');
      return;
    }

    try {
      const settings = generateSettingsString(run, references);
      const thumbnailUrl = await generateThumbnail(run.maps.albedo);

      await saveRecordMutation.mutateAsync({
        title: title.trim(),
        creativeFreedom: run.creativeFreedom,
        settings,
        thumbnailUrl,
      });

      toast.success('Creation saved to gallery');
      setOpen(false);
      setTitle('');
      setMarkedUsable(false);
    } catch (error) {
      toast.error('Failed to save creation. Please ensure the creation is marked as usable.');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTitle('');
      setMarkedUsable(false);
    }
  };

  if (!identity) {
    return null;
  }

  const canSave = title.trim() && markedUsable && !saveRecordMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Save to Gallery
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Creation</DialogTitle>
          <DialogDescription>
            Save this texture generation to your gallery. Full 4K images remain client-side for export.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for this creation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canSave && handleSave()}
            />
          </div>
          <div className="flex items-start space-x-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Checkbox
              id="usable"
              checked={markedUsable}
              onCheckedChange={(checked) => setMarkedUsable(checked === true)}
              className="mt-0.5"
            />
            <div className="flex-1 space-y-1">
              <Label
                htmlFor="usable"
                className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Mark as usable
              </Label>
              <p className="text-xs text-muted-foreground">
                I confirm this creation is ready to be saved and displayed in the gallery
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            {saveRecordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
