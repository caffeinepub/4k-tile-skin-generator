import { Link, useRouterState } from '@tanstack/react-router';
import { Layers } from 'lucide-react';
import LoginButton from './Auth/LoginButton';

export default function AppHeader() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img 
              src="/assets/generated/logo-mark.dim_512x512.png" 
              alt="4K Tile Generator" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold tracking-tight">4K Tile Generator</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === '/' ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Workspace
            </Link>
            <Link
              to="/gallery"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath.startsWith('/gallery') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Gallery
            </Link>
          </nav>
        </div>

        <LoginButton />
      </div>
    </header>
  );
}
