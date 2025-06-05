import Link from 'next/link';
import { VeoPromptifyLogo } from '@/components/icons/logo';

export function AppHeader() {
  return (
    <header className="py-4 px-4 md:px-6 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <VeoPromptifyLogo />
        </Link>
      </div>
    </header>
  );
}
