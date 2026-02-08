import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MetricCard } from '../shared/MetricCard';
import { ChartCard } from '../shared/ChartCard';
import { StatusBadge } from '../shared/StatusBadge';
import { Package, Truck, Factory, BarChart3, AlertCircle, CheckCircle, Clock, ArrowRight, Play, Pause, TrendingUp, Boxes } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupplyChainLeafletMap } from '@/components/maps/SupplyChainLeafletMap';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Supply chain nodes - 10 nodes
const supplyChainNodes = [
  { id: 'supplier-1', name: 'Stahl Lieferant (Stuttgart)', lat: 48.7758, lng: 9.1829, type: 'supplier' as const, inventory: 85 },
  { id: 'supplier-2', name: 'Elektronik (München)', lat: 48.1351, lng: 11.5820, type: 'supplier' as const, inventory: 92 },
  { id: 'supplier-3', name: 'Kunststoffe (Frankfurt)', lat: 50.1109, lng: 8.6821, type: 'supplier' as const, inventory: 78 },
  { id: 'supplier-4', name: 'Aluminium (Karlsruhe)', lat: 49.0069, lng: 8.4037, type: 'supplier' as const, inventory: 88 },
  { id: 'warehouse-1', name: 'Zentrallager Heilbronn', lat: 49.1427, lng: 9.2109, type: 'warehouse' as const, inventory: 88 },
  { id: 'warehouse-2', name: 'Regionallager Mannheim', lat: 49.4875, lng: 8.4660, type: 'warehouse' as const, inventory: 75 },
  { id: 'factory-1', name: 'Produktionswerk Heilbronn', lat: 49.1500, lng: 9.2200, type: 'factory' as const, inventory: 72 },
  { id: 'dc-1', name: 'Vertriebszentrum Nord', lat: 49.2333, lng: 9.3167, type: 'distribution' as const, inventory: 65 },
  { id: 'dc-2', name: 'Vertriebszentrum Süd', lat: 48.8582, lng: 9.2000, type: 'distribution' as const, inventory: 70 },
  { id: 'customer-1', name: 'Einzelhandelsnetzwerk', lat: 49.4500, lng: 8.6500, type: 'customer' as const, inventory: 0 },
];

// Supply chain flows - more flows for 10 nodes
const supplyFlows = [
  { from: 'supplier-1', to: 'warehouse-1', volume: 450, status: 'active' as const },
  { from: 'supplier-2', to: 'warehouse-1', volume: 280, status: 'active' as const },
  { from: 'supplier-3', to: 'warehouse-1', volume: 320, status: 'delayed' as const },
  { from: 'supplier-4', to: 'warehouse-2', volume: 380, status: 'active' as const },
  { from: 'warehouse-1', to: 'factory-1', volume: 850, status: 'active' as const },
  { from: 'warehouse-2', to: 'factory-1', volume: 420, status: 'active' as const },
  { from: 'factory-1', to: 'dc-1', volume: 620, status: 'active' as const },
  { from: 'factory-1', to: 'dc-2', volume: 480, status: 'active' as const },
  { from: 'dc-1', to: 'customer-1', volume: 580, status: 'active' as const },
  { from: 'dc-2', to: 'customer-1', volume: 440, status: 'active' as const },
];

// Inventory levels
const inventoryLevels = [
  { name: 'Rohmaterialien', current: 8540, min: 5000, max: 12000, reorderPoint: 6000, status: 'optimal' as const },
  { name: 'Komponenten', current: 4200, min: 2000, max: 8000, reorderPoint: 3000, status: 'optimal' as const },
  { name: 'Halbfabrikate', current: 1850, min: 500, max: 3000, reorderPoint: 800, status: 'optimal' as const },
  { name: 'Fertigprodukte', current: 2100, min: 1500, max: 5000, reorderPoint: 2000, status: 'low' as const },
];

// Weekly demand forecast
const demandForecast = [
  { week: 'W1', actual: 1450, predicted: 1420, confidence: 95 },
  { week: 'W2', actual: 1580, predicted: 1550, confidence: 93 },
  { week: 'W3', actual: 1320, predicted: 1380, confidence: 91 },
  { week: 'W4', actual: 1680, predicted: 1620, confidence: 94 },
  { week: 'W5', actual: null, predicted: 1720, confidence: 88 },
  { week: 'W6', actual: null, predicted: 1850, confidence: 82 },
  { week: 'W7', actual: null, predicted: 1780, confidence: 76 },
  { week: 'W8', actual: null, predicted: 1650, confidence: 70 },
];

// Supplier performance
const supplierPerformance = [
  { supplier: 'Stahl Lieferant', onTime: 94, quality: 98, leadTime: 5, risk: 'low' as const },
  { supplier: 'Elektronik', onTime: 97, quality: 99, leadTime: 7, risk: 'low' as const },
  { supplier: 'Kunststoffe', onTime: 82, quality: 95, leadTime: 4, risk: 'medium' as const },
  { supplier: 'Aluminium', onTime: 91, quality: 97, leadTime: 3, risk: 'low' as const },
];

// Simulation timeline - updated for 10 nodes
const simulationSteps = [
  { step: 1, description: 'Rohmaterialien werden aus Stuttgart versandt', node: 'supplier-1' },
  { step: 2, description: 'Elektronik wird aus München versendet', node: 'supplier-2' },
  { step: 3, description: 'Materialien erreichen das Zentrallager', node: 'warehouse-1' },
  { step: 4, description: 'Produktion im Heilbronner Werk beginnt', node: 'factory-1' },
  { step: 5, description: 'Fertigprodukte zum Vertriebszentrum Nord', node: 'dc-1' },
  { step: 6, description: 'Produkte an das Einzelhandelsnetzwerk geliefert', node: 'customer-1' },
];

// Disruption alerts
const disruptions = [
  { id: 1, type: 'delay', source: 'Plastics Supplier', impact: 'Medium', eta: '2 days delay', action: 'Re-route via alternate supplier' },
  { id: 2, type: 'shortage', source: 'Component B7', impact: 'Low', eta: '5 days', action: 'Safety stock activated' },
];

// Cost breakdown
const costBreakdown = [
  { category: 'Transportation', value: 125000, percentage: 28, color: '#3b82f6' },
  { category: 'Warehousing', value: 98000, percentage: 22, color: '#22c55e' },
  { category: 'Procurement', value: 156000, percentage: 35, color: '#f97316' },
  { category: 'Handling', value: 45000, percentage: 10, color: '#8b5cf6' },
  { category: 'Other', value: 22000, percentage: 5, color: '#64748b' },
];

// Supply chain KPIs radar
const kpiRadar = [
  { kpi: 'Delivery', value: 94, fullMark: 100 },
  { kpi: 'Quality', value: 97, fullMark: 100 },
  { kpi: 'Lead Time', value: 88, fullMark: 100 },
  { kpi: 'Cost', value: 82, fullMark: 100 },
  { kpi: 'Flexibility', value: 78, fullMark: 100 },
  { kpi: 'Visibility', value: 91, fullMark: 100 },
];

// Monthly throughput
const monthlyThroughput = [
  { month: 'Aug', inbound: 4200, outbound: 3900, turnover: 4.2 },
  { month: 'Sep', inbound: 4500, outbound: 4200, turnover: 4.5 },
  { month: 'Oct', inbound: 4100, outbound: 4300, turnover: 4.8 },
  { month: 'Nov', inbound: 4800, outbound: 4500, turnover: 4.3 },
  { month: 'Dec', inbound: 5200, outbound: 4800, turnover: 4.1 },
  { month: 'Jan', inbound: 4600, outbound: 4400, turnover: 4.6 },
];

export function SupplyChainTab() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % simulationSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const totalInventoryValue = 2450000;
  const stockoutRisk = 3.2;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">AI Supply Chain Analytics</h2>
          <p className="text-muted-foreground">End-to-end visibility with predictive optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isSimulating ? "secondary" : "default"}
            size="sm"
            onClick={() => setIsSimulating(!isSimulating)}
            className="gap-2"
          >
            {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isSimulating ? 'Pause' : 'Simulate Flow'}
          </Button>
          {disruptions.length > 0 && (
            <StatusBadge status="warning" label={`${disruptions.length} Alerts`} />
          )}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Inventory Value"
          value={`€${(totalInventoryValue / 1000000).toFixed(2)}M`}
          subtitle="Across all locations"
          icon={Package}
          iconColor="text-primary"
          delay={0}
        />
        <MetricCard
          title="On-Time Delivery"
          value="94.2%"
          change={2.1}
          changeLabel="vs last month"
          icon={CheckCircle}
          iconColor="text-green-500"
          delay={0.1}
        />
        <MetricCard
          title="Stockout Risk"
          value={`${stockoutRisk}%`}
          subtitle="Next 7 days"
          icon={AlertCircle}
          iconColor="text-amber-500"
          delay={0.2}
        />
        <MetricCard
          title="Lead Time"
          value="4.8 days"
          change={-12}
          changeLabel="improvement"
          icon={Clock}
          iconColor="text-accent"
          delay={0.3}
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Supply Chain Map */}
        <ChartCard
          title="Supply Chain Network"
          subtitle="CartoDB Dark • Real-time flow visualization"
          className="lg:col-span-2"
          delay={0.4}
          insight="Plastics supplier showing 82% on-time rate. AI recommends pre-ordering 15% additional buffer stock or activating secondary supplier contract."
        >
          <div className="h-[420px] rounded-lg overflow-hidden map-container">
            <SupplyChainLeafletMap
              center={[49.2, 9.5]}
              zoom={7}
              className="h-full w-full"
              nodes={supplyChainNodes}
              flows={supplyFlows}
              isSimulating={isSimulating}
              currentStepNodeId={isSimulating ? simulationSteps[currentStep]?.node : undefined}
              onSelectNode={(nodeId) => setSelectedNode(nodeId)}
            />
          </div>

          {/* Simulation Status */}
          {isSimulating && (
            <motion.div
              className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </div>
                <span className="text-sm font-medium">
                  Step {currentStep + 1}: {simulationSteps[currentStep]?.description}
                </span>
              </div>
            </motion.div>
          )}
        </ChartCard>

        {/* Supply Chain KPIs Radar */}
        <ChartCard
          title="Supply Chain KPIs"
          subtitle="Performance scorecard"
          delay={0.5}
        >
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={kpiRadar}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="kpi" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Overall Score: <span className="font-semibold text-primary">88.3%</span>
          </p>
        </ChartCard>
      </div>

      {/* Inventory Levels */}
      <ChartCard
        title="Inventory Status"
        subtitle="Current stock levels across categories"
        delay={0.6}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {inventoryLevels.map((item, i) => (
            <motion.div
              key={item.name}
              className="p-4 rounded-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{item.name}</span>
                {item.status === 'low' && (
                  <StatusBadge status="warning" label="Low" />
                )}
              </div>
              <div className="text-2xl font-bold mb-2">{item.current.toLocaleString()}</div>
              <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
                  style={{ left: `${(item.reorderPoint / item.max) * 100}%` }}
                />
                <motion.div
                  className={`h-full rounded-full ${
                    item.current > item.reorderPoint ? 'bg-primary' : 'bg-amber-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.current / item.max) * 100}%` }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{item.min.toLocaleString()}</span>
                <span>Reorder: {item.reorderPoint.toLocaleString()}</span>
                <span>{item.max.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </ChartCard>

      {/* Disruption Alerts */}
      {disruptions.length > 0 && (
        <ChartCard
          title="Active Disruption Alerts"
          subtitle="AI-detected supply chain risks"
          delay={0.7}
        >
          <div className="grid md:grid-cols-2 gap-4">
            {disruptions.map((alert, i) => (
              <motion.div
                key={alert.id}
                className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{alert.source}</span>
                      <StatusBadge
                        status={alert.impact === 'Low' ? 'info' : 'warning'}
                        label={alert.impact}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Type: {alert.type} | ETA: {alert.eta}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <span>AI Recommendation:</span>
                      <span className="font-medium">{alert.action}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Demand Forecast */}
        <ChartCard
          title="AI Demand Forecast"
          subtitle="8-week prediction with confidence intervals"
          delay={0.8}
          insight="Week 6 shows 18% surge in predicted demand. AI recommends increasing production capacity by 12% starting Week 5 to meet anticipated orders."
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={demandForecast}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }} 
              />
              <Area
                type="monotone"
                dataKey="predicted"
                name="AI Forecast"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorPredicted)"
              />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly Throughput */}
        <ChartCard
          title="Monthly Throughput"
          subtitle="Inbound vs Outbound volumes"
          delay={0.9}
          insight="December peak handled successfully with 5,200 inbound units. Inventory turnover maintained at healthy 4.1x ratio."
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyThroughput}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }} 
              />
              <Bar dataKey="inbound" name="Inbound" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outbound" name="Outbound" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Cost Analysis Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cost Breakdown Pie */}
        <ChartCard
          title="Supply Chain Cost Distribution"
          subtitle="Monthly cost breakdown"
          delay={1.0}
        >
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `€${(value / 1000).toFixed(0)}K`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {costBreakdown.slice(0, 4).map((item) => (
              <div key={item.category} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.category}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Supplier Performance Table */}
        <ChartCard
          title="Supplier Performance Scorecard"
          subtitle="Key supplier metrics and risk assessment"
          className="lg:col-span-2"
          delay={1.1}
        >
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>On-Time Rate</th>
                  <th>Quality Score</th>
                  <th>Lead Time</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {supplierPerformance.map((supplier, i) => (
                  <motion.tr
                    key={supplier.supplier}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 + i * 0.1 }}
                  >
                    <td className="font-medium">{supplier.supplier}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              supplier.onTime >= 90 ? 'bg-green-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${supplier.onTime}%` }}
                          />
                        </div>
                        <span className="text-xs">{supplier.onTime}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">{supplier.quality}%</span>
                    </td>
                    <td>{supplier.leadTime} days</td>
                    <td>
                      <StatusBadge
                        status={supplier.risk === 'low' ? 'success' : supplier.risk === 'medium' ? 'warning' : 'danger'}
                        label={supplier.risk}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
