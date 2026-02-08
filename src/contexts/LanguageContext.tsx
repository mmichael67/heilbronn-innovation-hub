import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'de' | 'en';

interface Translations {
  [key: string]: {
    de: string;
    en: string;
  };
}

// All translations for the app
export const translations: Translations = {
  // Header
  'header.digitalTwin': { de: 'Digitaler Zwilling', en: 'Digital Twin' },
  'header.fleetRouting': { de: 'Flottenlogistik', en: 'Fleet Logistics' },
  'header.predictive': { de: 'Vorausschauende Wartung', en: 'Predictive Maintenance' },
  'header.energy': { de: 'Energiemanagement', en: 'Energy Management' },
  'header.supplyChain': { de: 'Lieferkette', en: 'Supply Chain' },
  'header.platformTitle': { de: 'Intelligente Fertigungsplattform', en: 'Smart Manufacturing Platform' },
  
  // Digital Twin
  'digitalTwin.title': { de: 'Intelligenter Digitaler Fabrikzwilling', en: 'Smart Factory Digital Twin' },
  'digitalTwin.subtitle': { de: 'Echtzeit-3D-Visualisierung der Heilbronner Fertigungsanlage', en: 'Real-time 3D visualization of Heilbronn Manufacturing Facility' },
  'digitalTwin.liveSync': { de: 'Live-Synchronisation', en: 'Live Sync' },
  'digitalTwin.updatedAgo': { de: 'Aktualisiert vor 2s', en: 'Updated 2s ago' },
  'digitalTwin.oee': { de: 'Gesamtanlageneffektivität', en: 'Overall Equipment Effectiveness' },
  'digitalTwin.vsLastWeek': { de: 'ggü. letzter Woche', en: 'vs last week' },
  'digitalTwin.unitsToday': { de: 'Heute produzierte Einheiten', en: 'Units Produced Today' },
  'digitalTwin.aboveTarget': { de: 'über Ziel', en: 'above target' },
  'digitalTwin.activeMachines': { de: 'Aktive Maschinen', en: 'Active Machines' },
  'digitalTwin.offline': { de: 'offline (1 Wartung)', en: 'offline (1 maintenance)' },
  'digitalTwin.energyConsumption': { de: 'Energieverbrauch', en: 'Energy Consumption' },
  'digitalTwin.efficiencyGain': { de: 'Effizienzgewinn', en: 'efficiency gain' },
  'digitalTwin.factoryFloor': { de: '3D Fabrikhalle', en: '3D Factory Floor' },
  'digitalTwin.interactive': { de: 'Interaktiver digitaler Zwilling mit Umgebung', en: 'Interactive digital twin with environment' },
  'digitalTwin.machineStatus': { de: 'Maschinenstatus', en: 'Machine Status' },
  'digitalTwin.clickDetails': { de: 'Klicken für Details', en: 'Click to view details' },
  'digitalTwin.efficiency': { de: 'Effizienz', en: 'Efficiency' },
  'digitalTwin.temperature': { de: 'Temperatur', en: 'Temperature' },
  'digitalTwin.uptime': { de: 'Betriebszeit', en: 'Uptime' },
  'digitalTwin.production24h': { de: '24h Produktionsausstoß', en: '24h Production Output' },
  'digitalTwin.unitsVsTarget': { de: 'Produzierte Einheiten vs. Ziel', en: 'Units produced vs target' },
  'digitalTwin.equipmentStatus': { de: 'Anlagenstatus', en: 'Equipment Status' },
  'digitalTwin.currentDistribution': { de: 'Aktuelle Verteilung', en: 'Current distribution' },
  'digitalTwin.weeklyProduction': { de: 'Wöchentliche Produktionsübersicht', en: 'Weekly Production Summary' },
  'digitalTwin.unitsByDay': { de: 'Produzierte Einheiten nach Tag', en: 'Units produced by day' },
  'digitalTwin.running': { de: 'Laufend', en: 'Running' },
  'digitalTwin.idle': { de: 'Leerlauf', en: 'Idle' },
  'digitalTwin.maintenance': { de: 'Wartung', en: 'Maintenance' },
  
  // Fleet Routing
  'fleet.title': { de: 'KI-Flottenoptimierung', en: 'AI Fleet Route Optimization' },
  'fleet.subtitle': { de: 'Echtzeit-Fahrzeugrouting für die Region Heilbronn-Franken', en: 'Real-time vehicle routing for Heilbronn-Franken region' },
  'fleet.pause': { de: 'Pause', en: 'Pause' },
  'fleet.simulate': { de: 'Simulieren', en: 'Simulate' },
  'fleet.activeVehicles': { de: 'Aktive Fahrzeuge', en: 'Active Vehicles' },
  'fleet.inMaintenance': { de: 'in Wartung', en: 'in maintenance' },
  'fleet.distanceSaved': { de: 'Eingesparte Strecke', en: 'Distance Saved' },
  'fleet.vsManual': { de: 'ggü. manueller Routenplanung', en: 'vs manual routing' },
  'fleet.deliveriesToday': { de: 'Lieferungen heute', en: 'Deliveries Today' },
  'fleet.remaining': { de: 'verbleibend', en: 'remaining' },
  'fleet.fuelSavings': { de: 'Kraftstoffeinsparung', en: 'Fuel Savings' },
  'fleet.costReduction': { de: 'Kostenreduzierung', en: 'cost reduction' },
  'fleet.liveMap': { de: 'Live-Routenkarte', en: 'Live Route Map' },
  'fleet.streetRouting': { de: 'CartoDB Dark • OSRM Straßenführung', en: 'CartoDB Dark • OSRM Street Routing' },
  'fleet.activeRoutes': { de: 'Aktive Routen', en: 'Active Routes' },
  'fleet.clickHighlight': { de: 'Klicken zum Hervorheben auf der Karte', en: 'Click to highlight on map' },
  'fleet.weeklyPerformance': { de: 'Wöchentliche Leistungsentwicklung', en: 'Weekly Performance Trend' },
  'fleet.efficiencyDelivery': { de: 'Effizienz- und Liefermetriken', en: 'Efficiency and delivery metrics' },
  'fleet.operatingCost': { de: 'Betriebskostenverteilung', en: 'Operating Cost Breakdown' },
  'fleet.monthlyDistribution': { de: 'Monatliche Verteilung', en: 'Monthly distribution' },
  'fleet.aiOptimization': { de: 'KI-Optimierungswirkung', en: 'AI Optimization Impact' },
  'fleet.beforeAfter': { de: 'Vorher-Nachher-Vergleich', en: 'Before vs After comparison' },
  'fleet.co2Tracking': { de: 'CO₂-Emissionsverfolgung', en: 'CO₂ Emissions Tracking' },
  'fleet.monthlyEmissions': { de: 'Monatliche Emissionen und Einsparungen', en: 'Monthly emissions and savings' },
  'fleet.fleetStatus': { de: 'Flottenstatusübersicht', en: 'Fleet Status Overview' },
  'fleet.allVehicles': { de: 'Alle Fahrzeuge in Echtzeit', en: 'All vehicles in real-time' },
  'fleet.vehicle': { de: 'Fahrzeug', en: 'Vehicle' },
  'fleet.driver': { de: 'Fahrer', en: 'Driver' },
  'fleet.status': { de: 'Status', en: 'Status' },
  'fleet.speed': { de: 'Geschwindigkeit', en: 'Speed' },
  'fleet.fuelLevel': { de: 'Kraftstoffstand', en: 'Fuel Level' },
  
  // Predictive Maintenance
  'predictive.title': { de: 'KI-Vorausschauende Wartung', en: 'AI Predictive Maintenance' },
  'predictive.subtitle': { de: 'Maschinelles Lernen zur Fehlervorhersage und Wartungsoptimierung', en: 'Machine learning-based failure prediction and maintenance optimization' },
  'predictive.alertsActive': { de: 'Warnungen aktiv', en: 'Alerts Active' },
  'predictive.healthScore': { de: 'Anlagengesundheit', en: 'Equipment Health Score' },
  'predictive.fleetAverage': { de: 'Flottendetschnitt', en: 'Fleet average' },
  'predictive.failuresPrevented': { de: 'Verhinderte Ausfälle', en: 'Failures Prevented' },
  'predictive.thisQuarter': { de: 'dieses Quartal', en: 'this quarter' },
  'predictive.downtimeAvoided': { de: 'Vermiedene Ausfallzeit', en: 'Downtime Avoided' },
  'predictive.estValue': { de: 'Geschätzter Wert', en: 'Est. value' },
  'predictive.totalSavings': { de: 'Gesamteinsparungen', en: 'Total Cost Savings' },
  'predictive.vsReactive': { de: 'ggü. reaktiver Wartung', en: 'vs reactive maintenance' },
  'predictive.machineHealth': { de: 'Maschinengesundheitsmonitor', en: 'Machine Health Monitor' },
  'predictive.realTimeStatus': { de: 'Echtzeit-Anlagenstatus', en: 'Real-time equipment status' },
  'predictive.vibration': { de: 'Vibration', en: 'Vibration' },
  'predictive.nextService': { de: 'Nächste Wartung', en: 'Next Service' },
  'predictive.vibrationTrend': { de: 'Vibrationstrendanalyse', en: 'Vibration Trend Analysis' },
  'predictive.anomalyDetection': { de: 'Anomalieerkennung', en: 'Anomaly Detection' },
  'predictive.vibrationVsTemp': { de: 'Vibration vs. Temperatur', en: 'Vibration vs Temperature' },
  'predictive.aiAccuracy': { de: 'KI-Vorhersagegenauigkeit', en: 'AI Prediction Accuracy' },
  'predictive.predicted6months': { de: 'Vorhergesagt vs. tatsächliche Ausfälle über 6 Monate', en: 'Predicted vs Actual failures over 6 months' },
  'predictive.annualCost': { de: 'Jährlicher Kostenvergleich', en: 'Annual Cost Comparison' },
  'predictive.reactiveVsPredictive': { de: 'Reaktive vs. vorausschauende Wartung', en: 'Reactive vs Predictive maintenance' },
  'predictive.maintenanceSchedule': { de: 'Anstehender Wartungsplan', en: 'Upcoming Maintenance Schedule' },
  'predictive.aiWorkOrders': { de: 'KI-optimierte Arbeitsaufträge', en: 'AI-optimized work orders' },
  'predictive.machine': { de: 'Maschine', en: 'Machine' },
  'predictive.type': { de: 'Typ', en: 'Type' },
  'predictive.scheduled': { de: 'Geplant', en: 'Scheduled' },
  'predictive.priority': { de: 'Priorität', en: 'Priority' },
  'predictive.estCost': { de: 'Gesch. Kosten', en: 'Est. Cost' },
  'predictive.action': { de: 'Aktion', en: 'Action' },
  'predictive.schedule': { de: 'Planen', en: 'Schedule' },
  'predictive.mtbf': { de: 'Mittlere Zeit zwischen Ausfällen', en: 'Mean Time Between Failures' },
  'predictive.mtbfSubtitle': { de: 'MTBF-Trend über 6 Monate', en: 'MTBF trend over 6 months' },
  
  // Energy Management
  'energy.title': { de: 'Intelligentes Energiemanagement', en: 'Smart Energy Management' },
  'energy.subtitle': { de: 'KI-optimierter Energieverbrauch und Nachhaltigkeitsverfolgung', en: 'AI-optimized energy consumption and sustainability tracking' },
  'energy.currentPower': { de: 'Aktueller Stromverbrauch', en: 'Current Power Usage' },
  'energy.peakAt': { de: 'Spitze: 285 kW um 12:00', en: 'Peak: 285 kW at 12:00' },
  'energy.solarContribution': { de: 'Solarbeitrag', en: 'Solar Contribution' },
  'energy.vsYesterday': { de: 'ggü. gestern', en: 'vs yesterday' },
  'energy.costToday': { de: 'Kosten heute', en: 'Cost Today' },
  'energy.belowForecast': { de: 'unter Prognose', en: 'below forecast' },
  'energy.co2Emissions': { de: 'CO₂-Emissionen', en: 'CO₂ Emissions' },
  'energy.yoyReduction': { de: 'Reduzierung im Jahresvergleich', en: 'YoY reduction' },
  'energy.powerProfile': { de: '24-Stunden-Leistungsprofil', en: '24-Hour Power Profile' },
  'energy.consumptionVsSolar': { de: 'Verbrauch vs. Solarproduktion', en: 'Consumption vs Solar generation' },
  'energy.energyMix': { de: 'Energiemix', en: 'Energy Mix' },
  'energy.currentSources': { de: 'Aktuelle Stromquellen', en: 'Current power sources' },
  'energy.consumptionByZone': { de: 'Verbrauch nach Zone', en: 'Consumption by Zone' },
  'energy.realTimeZone': { de: 'Echtzeit-Zonenüberwachung', en: 'Real-time zone monitoring' },
  'energy.monthlyCostTrend': { de: 'Monatlicher Kostentrend', en: 'Monthly Cost Trend' },
  'energy.last6months': { de: 'Letzte 6 Monate', en: 'Last 6 months' },
  'energy.sustainability': { de: 'Nachhaltigkeits-Scorecard', en: 'Sustainability Scorecard' },
  'energy.envPerformance': { de: 'Umweltleistungskennzahlen', en: 'Environmental performance metrics' },
  'energy.aiRecommendations': { de: 'KI-Optimierungsempfehlungen', en: 'AI Optimization Recommendations' },
  'energy.actionableSavings': { de: 'Umsetzbare Energieeinsparungen', en: 'Actionable energy savings' },
  'energy.carbonTracking': { de: 'Kohlenstoffemissionsverfolgung', en: 'Carbon Emissions Tracking' },
  'energy.co2Offset': { de: 'Monatliche CO₂-Emissionen und Kompensation', en: 'Monthly CO₂ emissions and carbon offset' },
  'energy.downloadReport': { de: 'PDF-Bericht herunterladen', en: 'Download PDF Report' },
  'energy.totalConsumption': { de: 'Gesamtverbrauch', en: 'Total Consumption' },
  'energy.solarGeneration': { de: 'Solarproduktion', en: 'Solar Generation' },
  'energy.peakLimit': { de: 'Spitzenlimit', en: 'Peak Limit' },
  
  // Supply Chain
  'supply.title': { de: 'Intelligente Lieferkettenoptimierung', en: 'AI Supply Chain Optimization' },
  'supply.subtitle': { de: 'Echtzeit-Materialfluss und Bestandsverwaltung', en: 'Real-time material flow and inventory management' },
  'supply.supplierNodes': { de: 'Lieferantenknoten', en: 'Supplier Nodes' },
  'supply.allActive': { de: 'alle aktiv', en: 'all active' },
  'supply.inventoryTurnover': { de: 'Lagerumschlag', en: 'Inventory Turnover' },
  'supply.perMonth': { de: 'pro Monat', en: 'per month' },
  'supply.onTimeDelivery': { de: 'Pünktliche Lieferung', en: 'On-Time Delivery' },
  'supply.above': { de: 'über SLA', en: 'above SLA' },
  'supply.costReduction': { de: 'Kostenreduzierung', en: 'Cost Reduction' },
  'supply.throughOptimization': { de: 'durch Optimierung', en: 'through optimization' },
  'supply.networkMap': { de: 'Lieferketten-Netzwerkkarte', en: 'Supply Chain Network Map' },
  'supply.liveTracking': { de: 'Echtzeit-Materialflussverfolgung', en: 'Real-time material flow tracking' },
  'supply.inventoryLevels': { de: 'Bestandsübersicht', en: 'Inventory Levels' },
  'supply.allLocations': { de: 'Alle Standorte', en: 'All locations' },
  'supply.throughputAnalysis': { de: 'Durchsatzanalyse', en: 'Throughput Analysis' },
  'supply.daily': { de: 'Täglicher Materialfluss', en: 'Daily material flow' },
  'supply.kpiRadar': { de: 'Lieferketten-KPI-Radar', en: 'Supply Chain KPI Radar' },
  'supply.performanceMetrics': { de: 'Leistungskennzahlen', en: 'Performance metrics' },
  'supply.demandForecast': { de: 'Bedarfsprognose', en: 'Demand Forecast' },
  'supply.aiPredictions': { de: 'KI-Vorhersagen vs. tatsächliche Nachfrage', en: 'AI predictions vs actual demand' },
  'supply.riskMonitor': { de: 'Lieferanten-Risikomonitor', en: 'Supplier Risk Monitor' },
  'supply.riskAssessment': { de: 'Echtzeit-Risikobewertung', en: 'Real-time risk assessment' },
  
  // Footer
  'footer.platform': { de: 'IndustryAI Plattform', en: 'IndustryAI Platform' },
  'footer.description': { de: 'Intelligente Fertigungslösungen für die Region Heilbronn-Franken. Angetrieben von modernster KI und Industrie 4.0 Technologien.', en: 'Smart Manufacturing Solutions for the Heilbronn-Franken region. Powered by cutting-edge AI and Industry 4.0 technologies.' },
  'footer.technologies': { de: 'Technologien', en: 'Technologies' },
  'footer.quickLinks': { de: 'Schnellzugriff', en: 'Quick Links' },
  'footer.documentation': { de: 'Dokumentation', en: 'Documentation' },
  'footer.apiReference': { de: 'API-Referenz', en: 'API Reference' },
  'footer.caseStudies': { de: 'Fallstudien', en: 'Case Studies' },
  'footer.competition': { de: 'IHK Wettbewerb', en: 'IHK Competition' },
  'footer.contact': { de: 'Kontakt', en: 'Contact' },
  'footer.systemsOperational': { de: 'Alle Systeme betriebsbereit', en: 'All systems operational' },
  'footer.copyright': { de: '© 2026 IndustryAI • IHK Heilbronn-Franken • Jugend macht Zukunft', en: '© 2026 IndustryAI • IHK Heilbronn-Franken • Youth Creates Future' },
  
  // Common
  'common.day': { de: 'Tag', en: 'Day' },
  'common.week': { de: 'Woche', en: 'Week' },
  'common.month': { de: 'Monat', en: 'Month' },
  'common.stops': { de: 'Haltestellen', en: 'Stops' },
  'common.units': { de: 'Einheiten', en: 'units' },
  'common.high': { de: 'Hoch', en: 'High' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('de'); // German is default

  const t = useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
