import { useParams, useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Settings, Image as ImageIcon, Sparkles, Info } from 'lucide-react';
import RequireAuthenticated from '../components/Auth/RequireAuthenticated';
import { useGetAllCreationRecords } from '../hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CreationDetailPage() {
  return (
    <RequireAuthenticated>
      <CreationDetailContent />
    </RequireAuthenticated>
  );
}

function CreationDetailContent() {
  const { index } = useParams({ from: '/gallery/$index' });
  const search = useSearch({ from: '/gallery/$index' });
  const navigate = useNavigate();
  const { data: records } = useGetAllCreationRecords();

  const usableOnlyFilter = search.usableOnly ?? false;

  const allRecords = records || [];
  const filteredRecords = usableOnlyFilter
    ? allRecords.filter((record) => record.usable === true)
    : allRecords;
  const sortedRecords = [...filteredRecords].sort((a, b) => Number(b.timestamp - a.timestamp));
  const record = sortedRecords[Number(index)];

  const handleBackToGallery = () => {
    navigate({
      to: '/gallery',
      search: usableOnlyFilter ? { usableOnly: true } : {},
    });
  };

  if (!record) {
    return (
      <div className="container py-12">
        <Card className="p-12 text-center">
          <h2 className="text-xl font-semibold">Creation Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The requested creation could not be found or may not be marked as usable.
          </p>
          <Button onClick={handleBackToGallery} className="mt-4" variant="outline">
            Back to Gallery
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-6">
        <Button onClick={handleBackToGallery} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{record.title}</CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(Number(record.timestamp) / 1000000).toLocaleString()}
                  </CardDescription>
                </div>
                {record.creativeFreedom && (
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-4 w-4" />
                    Creative Freedom-B
                  </Badge>
                )}
              </div>
            </CardHeader>
            {record.thumbnailUrl && (
              <CardContent>
                <div className="overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={record.thumbnailUrl}
                    alt={record.title}
                    className="w-full"
                  />
                </div>
              </CardContent>
            )}
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Full 4K resolution textures (3840×2160) are exported directly from the generator workspace.
              This gallery stores creation metadata and preview thumbnails only.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Creation Composition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    1
                  </span>
                  Description (33.33%)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Written description and parameters guided the generation process.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    2
                  </span>
                  Reference Visuals (33.33%)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Reference images were used to influence the texture generation.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    3
                  </span>
                  Creative Freedom-B (33.33%)
                </h3>
                {record.creativeFreedom ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Creative Freedom-B mode was enabled for this generation.
                    </p>
                    <div className="flex gap-4 text-xs">
                      <div className="rounded-md bg-muted px-3 py-1.5">
                        <span className="font-medium">Temperature:</span> 1.5
                      </div>
                      <div className="rounded-md bg-muted px-3 py-1.5">
                        <span className="font-medium">Top-P:</span> 0.90
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Creative Freedom-B mode was not enabled for this generation.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution:</span>
                  <span className="font-medium">3840 × 2160 (4K)</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seamless:</span>
                  <span className="font-medium">Yes</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tileable:</span>
                  <span className="font-medium">Yes</span>
                </div>
                <Separator />
                <div>
                  <span className="text-muted-foreground">Settings:</span>
                  <p className="mt-1 rounded-md bg-muted p-2 font-mono text-xs">{record.settings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImageIcon className="h-5 w-5" />
                PBR Maps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-1" />
                  <span>Albedo (Base Color)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-2" />
                  <span>Normal (Surface Detail)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-3" />
                  <span>Roughness (Surface Finish)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-4" />
                  <span>Fluid (Wetness/Flow)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-5" />
                  <span>Metallic (Metal Mask)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
