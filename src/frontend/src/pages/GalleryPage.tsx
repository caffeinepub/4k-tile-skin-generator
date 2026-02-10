import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Image as ImageIcon, Calendar, Sparkles, Filter } from 'lucide-react';
import RequireAuthenticated from '../components/Auth/RequireAuthenticated';
import { useGetAllCreationRecords } from '../hooks/useQueries';

export default function GalleryPage() {
  return (
    <RequireAuthenticated>
      <GalleryContent />
    </RequireAuthenticated>
  );
}

function GalleryContent() {
  const { data: records, isLoading } = useGetAllCreationRecords();
  const navigate = useNavigate();
  const search = useSearch({ from: '/gallery' });
  const usableOnlyFilter = search.usableOnly ?? false;

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const allRecords = records || [];
  const filteredRecords = usableOnlyFilter
    ? allRecords.filter((record) => record.usable === true)
    : allRecords;
  const sortedRecords = [...filteredRecords].sort((a, b) => Number(b.timestamp - a.timestamp));

  const handleCardClick = (index: number) => {
    navigate({
      to: '/gallery/$index',
      params: { index: String(index) },
      search: usableOnlyFilter ? { usableOnly: true } : {},
    });
  };

  const toggleFilter = () => {
    navigate({
      to: '/gallery',
      search: usableOnlyFilter ? {} : { usableOnly: true },
      replace: true,
    });
  };

  return (
    <div className="container py-12">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Your Gallery</h1>
          <p className="mt-2 text-muted-foreground">
            Browse and manage your saved texture creations
          </p>
        </div>
        <Button
          variant={usableOnlyFilter ? 'default' : 'outline'}
          size="sm"
          onClick={toggleFilter}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Usable only
        </Button>
      </div>

      {sortedRecords.length === 0 ? (
        <Card className="flex min-h-[400px] items-center justify-center">
          <div className="text-center p-12">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No Saved Creations</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              {usableOnlyFilter
                ? 'No usable creations found. Try disabling the filter or generate textures in the workspace.'
                : 'Generate textures in the workspace and save them to build your gallery'}
            </p>
            <Button
              variant="link"
              onClick={() => navigate({ to: '/' })}
              className="mt-4"
            >
              Go to Workspace →
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedRecords.map((record, index) => (
            <div key={index} onClick={() => handleCardClick(index)} className="cursor-pointer">
              <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                {record.thumbnailUrl ? (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={record.thumbnailUrl}
                      alt={record.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-muted">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-1">{record.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    {new Date(Number(record.timestamp) / 1000000).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {record.creativeFreedom && (
                      <Badge variant="secondary" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        Creative Freedom-B
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
