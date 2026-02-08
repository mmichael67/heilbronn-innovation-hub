import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-full p-0.5">
      <Button
        variant={language === 'de' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 px-2 text-xs rounded-full"
        onClick={() => setLanguage('de')}
      >
        DE
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 px-2 text-xs rounded-full"
        onClick={() => setLanguage('en')}
      >
        EN
      </Button>
    </div>
  );
}
