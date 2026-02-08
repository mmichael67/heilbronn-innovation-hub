import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Home,
  Presentation,
  Factory,
  Truck,
  Wrench,
  Zap,
  Package,
  Target,
  Lightbulb,
  Award,
  Users,
  TrendingUp,
  Globe,
  Brain,
  BarChart3,
  Shield,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  notes: string[];
  background?: string;
  icon?: React.ReactNode;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Industry 4.0 AI Dashboard",
    subtitle: "Jugend macht Zukunft 2026 – IHK Heilbronn-Franken",
    icon: <Factory className="h-20 w-20" />,
    content: (
      <div className="text-center space-y-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full">
          <Award className="h-6 w-6 text-primary" />
          <span className="text-xl font-medium">Wettbewerbsprojekt 2026</span>
        </div>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Eine innovative Demonstrationsplattform für KI-gestützte Fertigungsoptimierung 
          und nachhaltige Industrieproduktion
        </p>
        <div className="flex justify-center gap-8 pt-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">5</div>
            <div className="text-sm text-muted-foreground">Module</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Interaktiv</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">2</div>
            <div className="text-sm text-muted-foreground">Sprachen</div>
          </div>
        </div>
      </div>
    ),
    notes: [
      "Begrüßung und Vorstellung des Teams",
      "Projekt wurde für den IHK Wettbewerb 'Jugend macht Zukunft 2026' entwickelt",
      "Fokus auf Industrie 4.0 Technologien und deren praktische Anwendung",
      "Vollständig interaktive Demo – kann live vorgeführt werden"
    ]
  },
  {
    id: 2,
    title: "Die Herausforderung",
    subtitle: "Warum Industrie 4.0?",
    icon: <Target className="h-16 w-16" />,
    content: (
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center gap-3">
            <span className="p-2 bg-red-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-500" />
            </span>
            Aktuelle Probleme
          </h3>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2.5" />
              <span>Unerwartete Maschinenausfälle kosten Milliarden</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2.5" />
              <span>Ineffiziente Lieferketten und Routenplanung</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2.5" />
              <span>Hoher Energieverbrauch und CO₂-Ausstoß</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2.5" />
              <span>Mangelnde Echtzeit-Übersicht über Produktion</span>
            </li>
          </ul>
        </div>
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center gap-3">
            <span className="p-2 bg-green-500/10 rounded-lg">
              <Lightbulb className="h-6 w-6 text-green-500" />
            </span>
            Unsere Lösung
          </h3>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 mt-2.5" />
              <span>KI-basierte vorausschauende Wartung</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 mt-2.5" />
              <span>Intelligente Flottenoptimierung in Echtzeit</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 mt-2.5" />
              <span>Energiemanagement mit Lastspitzenreduktion</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 mt-2.5" />
              <span>3D Digital Twin für vollständige Transparenz</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    notes: [
      "Erklären Sie die wirtschaftliche Relevanz: Ungeplante Ausfallzeiten kosten deutsche Industrie ~50 Mrd. Euro/Jahr",
      "Betonen Sie den Nachhaltigkeitsaspekt – wichtig für die Region Heilbronn-Franken",
      "Die Lösung adressiert alle vier Hauptprobleme mit einem integrierten Ansatz",
      "Übergänge zwischen Modulen zeigen – alle arbeiten zusammen"
    ]
  },
  {
    id: 3,
    title: "Modul 1: Digital Twin",
    subtitle: "Echtzeit 3D-Visualisierung der Fabrik",
    icon: <Factory className="h-16 w-16" />,
    content: (
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="text-3xl font-bold text-primary">3D</div>
              <div className="text-sm text-muted-foreground">Echtzeit-Visualisierung</div>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="text-3xl font-bold text-primary">12+</div>
              <div className="text-sm text-muted-foreground">Animierte Maschinen</div>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="text-3xl font-bold text-primary">Live</div>
              <div className="text-sm text-muted-foreground">Status-Monitoring</div>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="text-3xl font-bold text-primary">360°</div>
              <div className="text-sm text-muted-foreground">Interaktive Ansicht</div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Kernfunktionen:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Roboter, Förderbänder, CNC-Maschinen</li>
              <li>• Lasercutter und Schweißstationen</li>
              <li>• Hallenkran mit beweglichem Haken</li>
              <li>• Umgebungssimulation (Fluss, Straßen)</li>
            </ul>
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 aspect-video flex items-center justify-center border border-primary/20">
          <div className="text-center space-y-4">
            <Factory className="h-24 w-24 mx-auto text-primary/60" />
            <p className="text-lg text-muted-foreground">Live-Demo im Dashboard</p>
          </div>
        </div>
      </div>
    ),
    notes: [
      "Hier live zur Demo wechseln und die 3D-Ansicht zeigen",
      "Mit der Maus drehen, zoomen und die Animationen demonstrieren",
      "Erklären: React Three Fiber ermöglicht performante 3D im Browser",
      "Maschinenstatus zeigen – Farben signalisieren Betriebszustand"
    ]
  },
  {
    id: 4,
    title: "Modul 2: Flottenplanung",
    subtitle: "Intelligente Routenoptimierung",
    icon: <Truck className="h-16 w-16" />,
    content: (
      <div className="space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-500/5 rounded-xl border border-blue-500/20 text-center">
            <Truck className="h-10 w-10 mx-auto mb-3 text-blue-500" />
            <div className="text-2xl font-bold">10+</div>
            <div className="text-sm text-muted-foreground">Standorte</div>
          </div>
          <div className="p-6 bg-green-500/5 rounded-xl border border-green-500/20 text-center">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 text-green-500" />
            <div className="text-2xl font-bold">-23%</div>
            <div className="text-sm text-muted-foreground">Kraftstoff gespart</div>
          </div>
          <div className="p-6 bg-orange-500/5 rounded-xl border border-orange-500/20 text-center">
            <Globe className="h-10 w-10 mx-auto mb-3 text-orange-500" />
            <div className="text-2xl font-bold">OSRM</div>
            <div className="text-sm text-muted-foreground">Echte Straßendaten</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Technische Features</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">✓</span>
                <span>Dynamische Fahrzeuganimation auf Route</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">✓</span>
                <span>Echtzeit-Verkehrsdaten via OSRM API</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">✓</span>
                <span>Multi-Stopp Routenberechnung</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Geschäftsnutzen</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">€</span>
                <span>Reduzierte Transportkosten</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">🌱</span>
                <span>Geringerer CO₂-Fußabdruck</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">⏱</span>
                <span>Schnellere Lieferzeiten</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: [
      "In der Demo: Play-Button drücken und Fahrzeuge beobachten",
      "OSRM = Open Source Routing Machine, nutzt echte OpenStreetMap Daten",
      "Fahrzeuge bewegen sich entlang der berechneten Route, nicht teleportieren",
      "Vollbildmodus zeigen für bessere Sichtbarkeit"
    ]
  },
  {
    id: 5,
    title: "Modul 3: Vorausschauende Wartung",
    subtitle: "KI-gestützte Anomalieerkennung",
    icon: <Wrench className="h-16 w-16" />,
    content: (
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20">
            <Brain className="h-12 w-12 mb-4 text-purple-500" />
            <h4 className="text-xl font-semibold mb-2">KI-Analyse</h4>
            <p className="text-muted-foreground">
              Machine Learning erkennt Muster in Sensordaten und sagt Ausfälle 
              bis zu 2 Wochen im Voraus vorher.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-500">94%</div>
              <div className="text-xs text-muted-foreground">Erkennungsrate</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-500">-67%</div>
              <div className="text-xs text-muted-foreground">Ungeplante Stopps</div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-xl font-semibold">Dashboard-Metriken</h4>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Maschinenzustand</span>
                <span className="text-green-500">Gesund</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">MTBF Trend</span>
                <span className="text-blue-500">↑ Steigend</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Anomalie-Score</span>
                <span className="text-yellow-500">Niedrig</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '23%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: [
      "MTBF = Mean Time Between Failures – Schlüsselmetrik für Zuverlässigkeit",
      "In der Demo: Anomalie-Chart zeigen und erklären wie Ausreißer erkannt werden",
      "Erwähnen: Diese Technologie wird bereits bei großen Herstellern wie Bosch eingesetzt",
      "ROI: Wartungskosten sinken um bis zu 40% laut Studien"
    ]
  },
  {
    id: 6,
    title: "Modul 4: Energiemanagement",
    subtitle: "Nachhaltige Produktion",
    icon: <Zap className="h-16 w-16" />,
    content: (
      <div className="space-y-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-5 bg-yellow-500/5 rounded-xl border border-yellow-500/20 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-xl font-bold">24h</div>
            <div className="text-xs text-muted-foreground">Lastprofil</div>
          </div>
          <div className="p-5 bg-green-500/5 rounded-xl border border-green-500/20 text-center">
            <Leaf className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-xl font-bold">-18%</div>
            <div className="text-xs text-muted-foreground">CO₂ Reduktion</div>
          </div>
          <div className="p-5 bg-blue-500/5 rounded-xl border border-blue-500/20 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-xl font-bold">PDF</div>
            <div className="text-xs text-muted-foreground">Report-Export</div>
          </div>
          <div className="p-5 bg-purple-500/5 rounded-xl border border-purple-500/20 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-xl font-bold">€12k</div>
            <div className="text-xs text-muted-foreground">Ersparnis/Monat</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Funktionen</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span>24-Stunden Leistungsprofil mit Lastspitzen</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span>Kostenanalyse nach Tageszeit</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span>Automatischer PDF-Bericht für Management</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span>KI-basierte Optimierungsvorschläge</span>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-2xl border border-green-500/20">
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              Nachhaltigkeit
            </h4>
            <p className="text-muted-foreground">
              Durch intelligente Lastverschiebung und Spitzenreduktion 
              wird nicht nur Geld gespart, sondern auch der ökologische 
              Fußabdruck der Produktion minimiert.
            </p>
          </div>
        </div>
      </div>
    ),
    notes: [
      "In der Demo: PDF-Export zeigen – generiert professionellen Bericht",
      "Lastspitzen = teuerste Stromzeiten, wichtig für Industriekunden",
      "Nachhaltigkeit ist Kernthema in Heilbronn-Franken (Experimenta, Buga)",
      "Betonen: Wirtschaftlichkeit und Umweltschutz sind kein Widerspruch"
    ]
  },
  {
    id: 7,
    title: "Modul 5: Lieferkette",
    subtitle: "Transparente Materialflüsse",
    icon: <Package className="h-16 w-16" />,
    content: (
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20">
              <Package className="h-8 w-8 mb-2 text-indigo-500" />
              <div className="text-xl font-bold">10+</div>
              <div className="text-xs text-muted-foreground">Knotenpunkte</div>
            </div>
            <div className="p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20">
              <Globe className="h-8 w-8 mb-2 text-cyan-500" />
              <div className="text-xl font-bold">Live</div>
              <div className="text-xs text-muted-foreground">Tracking</div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Visualisierte Elemente:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Lieferanten und Zulieferer</li>
              <li>• Produktionsstandorte</li>
              <li>• Distributionszentren</li>
              <li>• Endkunden-Lieferung</li>
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-xl font-semibold">Echtzeitdaten</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span>Lagerbestand</span>
              </div>
              <span className="font-mono">2,847 Einheiten</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                <span>In Transit</span>
              </div>
              <span className="font-mono">12 Lieferungen</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                <span>Wartezeit</span>
              </div>
              <span className="font-mono">Ø 2.3 Stunden</span>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: [
      "In der Demo: Play drücken und Fahrzeuge auf der Karte verfolgen",
      "Lieferketten-Transparenz war großes Thema während COVID-19",
      "Zeigen wie Engpässe frühzeitig erkannt werden können",
      "Vollbildmodus für bessere Übersicht bei Präsentation"
    ]
  },
  {
    id: 8,
    title: "Technische Umsetzung",
    subtitle: "Moderne Web-Technologien",
    icon: <Shield className="h-16 w-16" />,
    content: (
      <div className="space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border bg-card">
            <div className="text-3xl mb-4">⚛️</div>
            <h4 className="font-semibold mb-2">React 18</h4>
            <p className="text-sm text-muted-foreground">
              Moderne Frontend-Bibliothek für performante, reaktive Benutzeroberflächen
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card">
            <div className="text-3xl mb-4">🎨</div>
            <h4 className="font-semibold mb-2">Three.js / R3F</h4>
            <p className="text-sm text-muted-foreground">
              React Three Fiber für hardwarebeschleunigte 3D-Grafiken im Browser
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card">
            <div className="text-3xl mb-4">🗺️</div>
            <h4 className="font-semibold mb-2">Leaflet + OSRM</h4>
            <p className="text-sm text-muted-foreground">
              Interaktive Karten mit echtem Straßen-Routing via OpenStreetMap
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Weitere Technologien</h4>
            <div className="flex flex-wrap gap-2">
              {['TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Vite', 'shadcn/ui', 'jsPDF'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Qualitätsmerkmale</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Responsives Design (Mobile & Desktop)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Zweisprachig (Deutsch/Englisch)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Gehostet auf GitHub Pages
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Open Source verfügbar
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: [
      "Technische Tiefe zeigen – wir verstehen die Technologien",
      "TypeScript = typsichere Programmierung, weniger Fehler",
      "Alles läuft im Browser, keine Server-Installation nötig",
      "Open Source: Code kann eingesehen und weiterentwickelt werden"
    ]
  },
  {
    id: 9,
    title: "Regionaler Bezug",
    subtitle: "Relevanz für Heilbronn-Franken",
    icon: <Users className="h-16 w-16" />,
    content: (
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h4 className="text-xl font-semibold flex items-center gap-3">
            <Factory className="h-6 w-6 text-primary" />
            Industriestandort
          </h4>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border bg-card">
              <div className="font-medium mb-1">Audi Neckarsulm</div>
              <p className="text-sm text-muted-foreground">Digital Twin & Predictive Maintenance</p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <div className="font-medium mb-1">Schwarz Gruppe</div>
              <p className="text-sm text-muted-foreground">Supply Chain & Flottenoptimierung</p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <div className="font-medium mb-1">Würth Gruppe</div>
              <p className="text-sm text-muted-foreground">Lagerlogistik & Energiemanagement</p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-xl font-semibold flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-primary" />
            Innovationsregion
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">1</span>
              <div>
                <div className="font-medium">Experimenta</div>
                <p className="text-sm text-muted-foreground">Science Center fördert MINT-Begeisterung</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">2</span>
              <div>
                <div className="font-medium">Campus Founders</div>
                <p className="text-sm text-muted-foreground">Startup-Ökosystem für Innovation</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">3</span>
              <div>
                <div className="font-medium">BUGA 2019 Vermächtnis</div>
                <p className="text-sm text-muted-foreground">Nachhaltige Stadtentwicklung</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    ),
    notes: [
      "Lokale Unternehmen nennen – zeigt dass wir die Region kennen",
      "IHK Heilbronn-Franken vertritt diese Unternehmen",
      "Projekt passt perfekt zur Innovationsstrategie der Region",
      "Erwähnen: Fachkräftemangel macht KI-Lösungen noch wichtiger"
    ]
  },
  {
    id: 10,
    title: "Zusammenfassung & Ausblick",
    subtitle: "Die Zukunft der Industrie",
    icon: <Award className="h-16 w-16" />,
    content: (
      <div className="space-y-10">
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { icon: <Factory className="h-6 w-6" />, label: "Digital Twin" },
            { icon: <Truck className="h-6 w-6" />, label: "Flottenplanung" },
            { icon: <Wrench className="h-6 w-6" />, label: "Wartung" },
            { icon: <Zap className="h-6 w-6" />, label: "Energie" },
            { icon: <Package className="h-6 w-6" />, label: "Lieferkette" },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-center">
              <div className="mx-auto mb-2 text-primary">{item.icon}</div>
              <div className="text-sm font-medium">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="text-center space-y-6">
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unser Dashboard zeigt, wie KI und moderne Webtechnologien 
            die Industrie effizienter, nachhaltiger und transparenter machen können.
          </p>
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
            <Globe className="h-8 w-8 text-primary" />
            <div className="text-left">
              <div className="font-semibold">Live Demo</div>
              <div className="text-sm text-muted-foreground">mmansurii.github.io/heilbronn-innovation-hub</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-6">
          <div className="text-center p-6 rounded-2xl border bg-card">
            <div className="text-4xl mb-2">🎯</div>
            <div className="font-medium">Praxisnah</div>
          </div>
          <div className="text-center p-6 rounded-2xl border bg-card">
            <div className="text-4xl mb-2">💡</div>
            <div className="font-medium">Innovativ</div>
          </div>
          <div className="text-center p-6 rounded-2xl border bg-card">
            <div className="text-4xl mb-2">🌱</div>
            <div className="font-medium">Nachhaltig</div>
          </div>
        </div>
      </div>
    ),
    notes: [
      "Kurze Zusammenfassung der 5 Module",
      "QR-Code oder Link zur Live-Demo bereithalten",
      "Fragen des Publikums beantworten",
      "Bedanken für die Aufmerksamkeit – Wettbewerbsslogan wiederholen: 'Jugend macht Zukunft!'"
    ]
  }
];

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'n') {
        setShowNotes((prev) => !prev);
      } else if (e.key === 'Escape') {
        window.location.href = '/';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(nextSlide, 8000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-card/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </a>
          </Button>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Presentation className="h-4 w-4" />
            Präsentation
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotes(!showNotes)}
            className={cn(showNotes && "bg-primary/10")}
          >
            Notizen {showNotes ? 'ausblenden' : 'anzeigen'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Slide Content */}
        <main className={cn("flex-1 flex flex-col", showNotes ? "w-3/4" : "w-full")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col p-8 lg:p-12"
            >
              {/* Slide Header */}
              <div className="mb-8 flex items-start gap-6">
                {slide.icon && (
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary shrink-0">
                    {slide.icon}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">{slide.title}</h1>
                  {slide.subtitle && (
                    <p className="text-xl text-muted-foreground">{slide.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Slide Content */}
              <div className="flex-1">
                {slide.content}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <footer className="px-8 py-4 border-t bg-card/50 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>

            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === currentSlide 
                      ? "bg-primary w-6" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              Weiter
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </footer>
        </main>

        {/* Speaker Notes */}
        {showNotes && (
          <aside className="w-1/4 border-l bg-muted/30 p-6 overflow-y-auto">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                {currentSlide + 1}
              </span>
              Präsentationsnotizen
            </h3>
            <ul className="space-y-3">
              {slide.notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{note}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 p-4 rounded-xl bg-background border">
              <h4 className="text-xs font-medium uppercase text-muted-foreground mb-2">Tastenkürzel</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>→ / Leertaste</span>
                  <span className="text-muted-foreground">Nächste Folie</span>
                </div>
                <div className="flex justify-between">
                  <span>←</span>
                  <span className="text-muted-foreground">Vorherige Folie</span>
                </div>
                <div className="flex justify-between">
                  <span>N</span>
                  <span className="text-muted-foreground">Notizen ein/aus</span>
                </div>
                <div className="flex justify-between">
                  <span>ESC</span>
                  <span className="text-muted-foreground">Zurück zum Dashboard</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
