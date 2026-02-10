import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import WorkspacePage from './pages/WorkspacePage';
import GalleryPage from './pages/GalleryPage';
import CreationDetailPage from './pages/CreationDetailPage';
import AppLayout from './components/AppLayout';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: WorkspacePage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: GalleryPage,
  validateSearch: (search: Record<string, unknown>): { usableOnly?: boolean } => {
    return {
      usableOnly: search.usableOnly === '1' || search.usableOnly === true,
    };
  },
});

const creationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery/$index',
  component: CreationDetailPage,
  validateSearch: (search: Record<string, unknown>): { usableOnly?: boolean } => {
    return {
      usableOnly: search.usableOnly === '1' || search.usableOnly === true,
    };
  },
});

const routeTree = rootRoute.addChildren([workspaceRoute, galleryRoute, creationDetailRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
