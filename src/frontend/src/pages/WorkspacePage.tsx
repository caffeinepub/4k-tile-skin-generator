import { useState } from 'react';
import { Card } from '@/components/ui/card';
import GenerationControls from '../components/Workspace/GenerationControls';
import ReferenceGallery from '../components/Workspace/ReferenceGallery';
import MapSetPreview from '../components/Workspace/MapSetPreview';
import PreviewModeTabs from '../components/Workspace/PreviewModeTabs';
import Tiling3DPreview from '../components/Workspace/Tiling3DPreview';
import ExportPanel from '../components/Workspace/ExportPanel';
import RunMetadata from '../components/Workspace/RunMetadata';
import RunComposition from '../components/Workspace/RunComposition';
import SaveCreationDialog from '../components/Workspace/SaveCreationDialog';
import ProfileSetupModal from '../components/Auth/ProfileSetupModal';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { GenerationRun, ReferenceImage } from '../types/generation';
import { generateTileablePBR } from '../lib/generation/generateTileablePbr';

export default function WorkspacePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();

  const [currentRun, setCurrentRun] = useState<GenerationRun | null>(null);
  const [references, setReferences] = useState<ReferenceImage[]>([]);
  const [previewMode, setPreviewMode] = useState<'2d' | '3d'>('2d');
  const [generating, setGenerating] = useState(false);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleGenerate = async (
    category: string,
    seed: number,
    variation: number,
    creativeFreedom: boolean,
    description: string
  ) => {
    setGenerating(true);
    try {
      const run = await generateTileablePBR({
        category,
        seed,
        variation,
        creativeFreedom,
        description,
        references,
      });
      setCurrentRun(run);
      setPreviewMode('2d');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveProfile = async (name: string) => {
    await saveProfileMutation.mutateAsync({ name });
  };

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} onSave={handleSaveProfile} />
      
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src="/assets/generated/hero-banner.dim_1920x640.png"
            alt=""
            className="h-64 w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Texture Generator</h1>
            <p className="mt-2 text-muted-foreground">
              Create seamless 4K PBR textures with advanced controls
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Generation Settings</h2>
                <GenerationControls onGenerate={handleGenerate} generating={generating} />
              </Card>

              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Reference Images</h2>
                <ReferenceGallery references={references} onChange={setReferences} />
              </Card>
            </div>

            <div className="space-y-6">
              {currentRun ? (
                <>
                  <Card className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Generated Textures</h2>
                      <SaveCreationDialog run={currentRun} references={references} />
                    </div>
                    <RunMetadata run={currentRun} />
                  </Card>

                  <Card className="p-6">
                    <PreviewModeTabs mode={previewMode} onChange={setPreviewMode} />
                    <div className="mt-6">
                      {previewMode === '2d' ? (
                        <MapSetPreview maps={currentRun.maps} />
                      ) : (
                        <Tiling3DPreview maps={currentRun.maps} />
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">Export Options</h2>
                    <ExportPanel run={currentRun} />
                  </Card>

                  <Card className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">Creation Composition</h2>
                    <RunComposition run={currentRun} references={references} />
                  </Card>
                </>
              ) : (
                <Card className="flex min-h-[400px] items-center justify-center p-12">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <h3 className="text-lg font-semibold">No Texture Generated Yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Configure your settings and click Generate to create your first 4K tileable texture
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
