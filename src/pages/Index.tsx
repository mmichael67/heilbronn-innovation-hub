import { Suspense, lazy, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

// Lazy load all tabs
const DigitalTwinTab = lazy(() => import('@/components/tabs/DigitalTwinTab').then((m) => ({ default: m.DigitalTwinTab })));
const FleetRoutingTab = lazy(() => import('@/components/tabs/FleetRoutingTab').then((m) => ({ default: m.FleetRoutingTab })));
const PredictiveMaintenanceTab = lazy(() => import('@/components/tabs/PredictiveMaintenanceTab').then((m) => ({ default: m.PredictiveMaintenanceTab })));
const EnergyManagementTab = lazy(() => import('@/components/tabs/EnergyManagementTab').then((m) => ({ default: m.EnergyManagementTab })));
const SupplyChainTab = lazy(() => import('@/components/tabs/SupplyChainTab').then((m) => ({ default: m.SupplyChainTab })));

const LoadingFallback = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-muted-foreground">Loading {name}...</p>
    </div>
  </div>
);

function IndexContent() {
  // Default tab is now Digital Twin
  const [activeTab, setActiveTab] = useState('digital-twin');
  const { t } = useLanguage();

  const renderTab = () => {
    switch (activeTab) {
      case 'digital-twin':
        return (
          <Suspense fallback={<LoadingFallback name={t('header.digitalTwin')} />}>
            <DigitalTwinTab />
          </Suspense>
        );
      case 'fleet-routing':
        return (
          <Suspense fallback={<LoadingFallback name={t('header.fleetRouting')} />}>
            <FleetRoutingTab />
          </Suspense>
        );
      case 'predictive':
        return (
          <Suspense fallback={<LoadingFallback name={t('header.predictive')} />}>
            <PredictiveMaintenanceTab />
          </Suspense>
        );
      case 'energy':
        return (
          <Suspense fallback={<LoadingFallback name={t('header.energy')} />}>
            <EnergyManagementTab />
          </Suspense>
        );
      case 'supply-chain':
        return (
          <Suspense fallback={<LoadingFallback name={t('header.supplyChain')} />}>
            <SupplyChainTab />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingFallback name={t('header.digitalTwin')} />}>
            <DigitalTwinTab />
          </Suspense>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="container max-w-7xl mx-auto"
        >
          <ErrorBoundary
            fallback={
              <div className="p-6 text-center">
                <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  This tab encountered an error. Please try switching to another tab.
                </p>
                <button 
                  onClick={() => setActiveTab('digital-twin')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
                >
                  Go to Digital Twin
                </button>
              </div>
            }
          >
            {renderTab()}
          </ErrorBoundary>
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
