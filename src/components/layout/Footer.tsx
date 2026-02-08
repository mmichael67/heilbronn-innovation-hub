import { Github, ExternalLink, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/50 mt-12">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.platform')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.technologies')}</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                3D Digital Twin
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Route Optimization
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Predictive Analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Energy Management
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.quickLinks')}</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">{t('footer.documentation')}</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">{t('footer.apiReference')}</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">{t('footer.caseStudies')}</a>
              </li>
              <li>
                <a 
                  href="https://veranstaltungen.heilbronn.ihk.de/b?p=JmZ2026" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {t('footer.competition')} <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.contact')}</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                Heilbronn, Germany
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                info@industryai.de
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                +49 7131 XXX XXX
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Fixed green light positioning */}
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-green-500 whitespace-nowrap">{t('footer.systemsOperational')}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {t('footer.copyright')}
          </div>
        </div>
      </div>
    </footer>
  );
}
