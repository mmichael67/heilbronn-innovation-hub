import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { MetricCard } from '../shared/MetricCard';
import { ChartCard } from '../shared/ChartCard';
import { StatusBadge } from '../shared/StatusBadge';
import { Zap, Leaf, TrendingDown, Sun, Battery, ThermometerSun, Wind, BarChart3, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend
} from 'recharts';

// Real-time power consumption
const powerConsumption = [
  { time: '00:00', consumption: 145, solar: 0, grid: 145, peak: 280 },
  { time: '02:00', consumption: 120, solar: 0, grid: 120, peak: 280 },
  { time: '04:00', consumption: 135, solar: 0, grid: 135, peak: 280 },
  { time: '06:00', consumption: 180, solar: 25, grid: 155, peak: 280 },
  { time: '08:00', consumption: 245, solar: 85, grid: 160, peak: 280 },
  { time: '10:00', consumption: 268, solar: 120, grid: 148, peak: 280 },
  { time: '12:00', consumption: 285, solar: 145, grid: 140, peak: 280 },
  { time: '14:00', consumption: 275, solar: 135, grid: 140, peak: 280 },
  { time: '16:00', consumption: 255, solar: 95, grid: 160, peak: 280 },
  { time: '18:00', consumption: 220, solar: 35, grid: 185, peak: 280 },
  { time: '20:00', consumption: 175, solar: 0, grid: 175, peak: 280 },
  { time: '22:00', consumption: 155, solar: 0, grid: 155, peak: 280 },
];

// Energy sources breakdown
const energySources = [
  { name: 'Grid (Renewable)', value: 45, color: '#22c55e' },
  { name: 'Solar Panels', value: 28, color: '#f59e0b' },
  { name: 'Grid (Conventional)', value: 22, color: '#6b7280' },
  { name: 'Battery Storage', value: 5, color: '#3b82f6' },
];

// Monthly consumption trend
const monthlyTrend = [
  { month: 'Aug', consumption: 89500, cost: 15800, target: 85000 },
  { month: 'Sep', consumption: 87200, cost: 15400, target: 85000 },
  { month: 'Oct', consumption: 84100, cost: 14850, target: 85000 },
  { month: 'Nov', consumption: 82400, cost: 14550, target: 85000 },
  { month: 'Dec', consumption: 86200, cost: 15220, target: 85000 },
  { month: 'Jan', consumption: 78500, cost: 13850, target: 85000 },
];

// Zone consumption
const zoneConsumption = [
  { zone: 'Production Hall A', consumption: 4250, percentage: 35, status: 'optimal' as const },
  { zone: 'Production Hall B', consumption: 3180, percentage: 26, status: 'optimal' as const },
  { zone: 'Assembly Line', consumption: 2100, percentage: 17, status: 'high' as const },
  { zone: 'Warehouse', consumption: 1450, percentage: 12, status: 'optimal' as const },
  { zone: 'Office Building', consumption: 780, percentage: 6, status: 'optimal' as const },
  { zone: 'HVAC Systems', consumption: 480, percentage: 4, status: 'high' as const },
];

// CO2 emissions data
const emissionsData = [
  { month: 'Aug', emissions: 42.5, offset: 12 },
  { month: 'Sep', emissions: 41.2, offset: 13 },
  { month: 'Oct', emissions: 39.8, offset: 14 },
  { month: 'Nov', emissions: 38.5, offset: 15 },
  { month: 'Dec', emissions: 40.1, offset: 14 },
  { month: 'Jan', emissions: 35.2, offset: 16 },
];

// AI recommendations
const aiRecommendations = [
  {
    title: 'Shift Production Peak Hours',
    description: 'Move high-energy processes to 10:00-14:00 to maximize solar utilization.',
    savings: '€420/month',
    impact: 'High',
    status: 'new' as const,
  },
  {
    title: 'HVAC Optimization',
    description: 'Reduce cooling in Warehouse Zone by 2°C during non-operational hours.',
    savings: '€180/month',
    impact: 'Medium',
    status: 'implemented' as const,
  },
  {
    title: 'LED Lighting Upgrade',
    description: 'Replace remaining fluorescent fixtures in Hall B with smart LED systems.',
    savings: '€95/month',
    impact: 'Low',
    status: 'pending' as const,
  },
];

// Sustainability metrics radial chart
const sustainabilityMetrics = [
  { name: 'Carbon Neutral', value: 73, fill: '#22c55e' },
  { name: 'Renewable Energy', value: 68, fill: '#3b82f6' },
  { name: 'Waste Recycled', value: 91, fill: '#f59e0b' },
  { name: 'Water Efficiency', value: 85, fill: '#06b6d4' },
];

export function EnergyManagementTab() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');

  const totalConsumptionToday = powerConsumption.reduce((acc, d) => acc + d.consumption, 0) / 12;
  const solarContribution = (powerConsumption.reduce((acc, d) => acc + d.solar, 0) / powerConsumption.reduce((acc, d) => acc + d.consumption, 0) * 100).toFixed(1);

  const generatePDFReport = useCallback(() => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('de-DE');
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175);
    doc.text('IndustryAI Energiebericht', 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generiert am: ${date}`, 20, 35);
    doc.text('Heilbronn Manufacturing Facility', 20, 42);
    
    // Divider
    doc.setDrawColor(200);
    doc.line(20, 48, 190, 48);
    
    // Key Metrics Section
    doc.setFontSize(16);
    doc.setTextColor(30, 64, 175);
    doc.text('Wichtige Kennzahlen', 20, 60);
    
    doc.setFontSize(11);
    doc.setTextColor(60);
    const metrics = [
      ['Aktueller Verbrauch:', '268 kW'],
      ['Solarbeitrag:', `${solarContribution}%`],
      ['Kosten heute:', '€487'],
      ['CO₂-Emissionen:', '35.2 Tonnen'],
      ['Durchschnittsverbrauch:', `${totalConsumptionToday.toFixed(0)} kW`],
    ];
    
    let y = 70;
    metrics.forEach(([label, value]) => {
      doc.setTextColor(100);
      doc.text(label, 25, y);
      doc.setTextColor(30, 64, 175);
      doc.text(value, 100, y);
      y += 8;
    });
    
    // Energy Sources
    doc.setFontSize(16);
    doc.setTextColor(30, 64, 175);
    doc.text('Energiequellen', 20, y + 15);
    
    y += 25;
    doc.setFontSize(11);
    energySources.forEach((source) => {
      doc.setTextColor(100);
      doc.text(`${source.name}:`, 25, y);
      doc.setTextColor(30, 64, 175);
      doc.text(`${source.value}%`, 100, y);
      y += 8;
    });
    
    // Recommendations
    doc.setFontSize(16);
    doc.setTextColor(30, 64, 175);
    doc.text('KI-Empfehlungen', 20, y + 15);
    
    y += 25;
    doc.setFontSize(10);
    aiRecommendations.forEach((rec, i) => {
      doc.setTextColor(60);
      doc.text(`${i + 1}. ${rec.title}`, 25, y);
      doc.setTextColor(34, 197, 94);
      doc.text(`Einsparung: ${rec.savings}`, 130, y);
      y += 6;
      doc.setTextColor(100);
      doc.text(rec.description, 30, y, { maxWidth: 150 });
      y += 12;
    });
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('© 2026 IndustryAI • IHK Heilbronn-Franken • Jugend macht Zukunft', 20, 280);
    
    doc.save('IndustryAI-Energiebericht.pdf');
  }, [solarContribution, totalConsumptionToday]);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">Smart Energy Management</h2>
          <p className="text-muted-foreground">AI-optimized energy consumption and sustainability tracking</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
          {(['day', 'week', 'month'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Power Usage"
          value="268 kW"
          subtitle="Peak: 285 kW at 12:00"
          icon={Zap}
          iconColor="text-amber-500"
          delay={0}
        />
        <MetricCard
          title="Solar Contribution"
          value={`${solarContribution}%`}
          change={12}
          changeLabel="vs yesterday"
          icon={Sun}
          iconColor="text-yellow-500"
          delay={0.1}
        />
        <MetricCard
          title="Cost Today"
          value="€487"
          change={-8}
          changeLabel="below forecast"
          icon={TrendingDown}
          iconColor="text-green-500"
          delay={0.2}
        />
        <MetricCard
          title="CO₂ Emissions"
          value="35.2 t"
          change={-17}
          changeLabel="YoY reduction"
          icon={Leaf}
          iconColor="text-emerald-500"
          delay={0.3}
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Power Consumption Chart */}
        <ChartCard
          title="24-Hour Power Profile"
          subtitle="Consumption vs Solar generation"
          className="lg:col-span-2"
          delay={0.4}
          insight="Solar panels provided 28% of today's energy demand. Shifting assembly line operations to 10:00-14:00 could increase solar utilization by an additional 12%."
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={powerConsumption}>
              <defs>
                <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(215, 80%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(215, 80%, 50%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(45, 95%, 50%)" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="hsl(45, 95%, 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" label={{ value: 'kW', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px' }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="consumption"
                name="Gesamtverbrauch"
                stroke="hsl(215, 80%, 50%)"
                strokeWidth={2}
                fill="url(#colorConsumption)"
              />
              <Area
                type="monotone"
                dataKey="solar"
                name="Solarproduktion"
                stroke="hsl(45, 95%, 50%)"
                strokeWidth={2}
                fill="url(#colorSolar)"
              />
              <Line
                type="monotone"
                dataKey="peak"
                name="Spitzenlimit"
                stroke="hsl(0, 75%, 55%)"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Energy Sources Pie */}
        <ChartCard
          title="Energy Mix"
          subtitle="Current power sources"
          delay={0.5}
        >
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={energySources}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                  labelLine={false}
                >
                  {energySources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {energySources.map((source) => (
              <div key={source.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                <span className="truncate">{source.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Zone Consumption */}
        <ChartCard
          title="Consumption by Zone"
          subtitle="Real-time zone monitoring"
          delay={0.6}
        >
          <div className="space-y-3">
            {zoneConsumption.map((zone, i) => (
              <motion.div
                key={zone.zone}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{zone.zone}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{zone.consumption} kW</span>
                    {zone.status === 'high' && (
                      <StatusBadge status="warning" label="High" />
                    )}
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      zone.status === 'optimal' ? 'bg-primary' : 'bg-amber-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.percentage}%` }}
                    transition={{ delay: 0.7 + i * 0.05, duration: 0.6 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>

        {/* Monthly Trend */}
        <ChartCard
          title="Monthly Cost Trend"
          subtitle="Last 6 months"
          className="lg:col-span-2"
          delay={0.7}
          insight="January achieved €13,850 - the lowest monthly cost in 12 months. AI recommendations implemented in Q4 contributed to 12% reduction in energy costs."
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" tickFormatter={(value) => `€${value/1000}K`} />
              <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
              <Bar dataKey="cost" name="Energy Cost" fill="hsl(215, 80%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Third Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sustainability Score */}
        <ChartCard
          title="Sustainability Scorecard"
          subtitle="Environmental performance metrics"
          delay={0.8}
          insight="On track to achieve carbon neutrality by 2027. Current renewable energy adoption exceeds industry average by 23%."
        >
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="100%"
              barSize={12}
              data={sustainabilityMetrics}
              startAngle={180}
              endAngle={-180}
            >
              <RadialBar
                background
                dataKey="value"
                cornerRadius={6}
              />
              <Legend
                iconSize={8}
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '11px' }}
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* AI Recommendations */}
        <ChartCard
          title="AI Optimization Recommendations"
          subtitle="Actionable energy savings"
          delay={0.9}
        >
          <div className="space-y-3">
            {aiRecommendations.map((rec, i) => (
              <motion.div
                key={i}
                className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-sm">{rec.title}</span>
                  <StatusBadge
                    status={rec.status === 'new' ? 'info' : rec.status === 'implemented' ? 'success' : 'warning'}
                    label={rec.status}
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600 font-medium">{rec.savings}</span>
                  <span className="text-muted-foreground">Impact: {rec.impact}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* CO2 Emissions Chart + PDF Download */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard
          title="Kohlenstoffemissionsverfolgung"
          subtitle="Monatliche CO₂-Emissionen und Kompensation"
          className="lg:col-span-2"
          delay={1.0}
          insight="Netto-Emissionen um 17% im Jahresvergleich reduziert. Das Kompensationsprogramm deckt 45% der verbleibenden Emissionen durch zertifizierte Waldschutzprojekte ab."
        >
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={emissionsData}>
              <defs>
                <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(215, 80%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(215, 80%, 50%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOffset" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(150, 70%, 40%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(150, 70%, 40%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" label={{ value: 'Tonnen CO₂', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area
                type="monotone"
                dataKey="emissions"
                name="Bruttoemissionen"
                stroke="hsl(215, 80%, 50%)"
                strokeWidth={2}
                fill="url(#colorEmissions)"
              />
              <Area
                type="monotone"
                dataKey="offset"
                name="CO₂-Kompensation"
                stroke="hsl(150, 70%, 40%)"
                strokeWidth={2}
                fill="url(#colorOffset)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* PDF Report Download */}
        <ChartCard
          title="Bericht herunterladen"
          subtitle="Energiebericht als PDF exportieren"
          delay={1.1}
        >
          <div className="flex flex-col items-center justify-center h-[200px] gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Generieren Sie einen detaillierten Energiebericht mit allen Metriken und Empfehlungen.
            </p>
            <Button 
              onClick={generatePDFReport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              PDF-Bericht herunterladen
            </Button>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
