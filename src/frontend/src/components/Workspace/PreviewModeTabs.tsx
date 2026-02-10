import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Box } from 'lucide-react';

interface PreviewModeTabsProps {
  mode: '2d' | '3d';
  onChange: (mode: '2d' | '3d') => void;
}

export default function PreviewModeTabs({ mode, onChange }: PreviewModeTabsProps) {
  return (
    <Tabs value={mode} onValueChange={(v) => onChange(v as '2d' | '3d')}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="2d" className="gap-2">
          <Image className="h-4 w-4" />
          2D Maps
        </TabsTrigger>
        <TabsTrigger value="3d" className="gap-2">
          <Box className="h-4 w-4" />
          3D Preview
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
