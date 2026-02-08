import { motion } from 'framer-motion';
import { useState } from 'react';
import { MetricCard } from '../shared/MetricCard';
import { ChartCard } from '../shared/ChartCard';
import { StatusBadge } from '../shared/StatusBadge';
import { ProgressBar } from '../shared/ProgressBar';
import { AlertTriangle, CheckCircle, Clock, Wrench, TrendingDown, Settings, Calendar, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';

// Machine health data
const machineHealthData = [
  { id: 'M-001', name: 'CNC Milling Center', health: 94, nextMaintenance: '12 days', vibration: 0.42, temperature: 45, status: 'healthy' as const },
  { id: 'M-002', name: 'Hydraulic Press', health: 78, nextMaintenance: '3 days', vibration: 0.68, temperature: 52, status: 'attention' as const },
  { id: 'M-003', name: 'Laser Cutting System', health: 65, nextMaintenance: '1 day', vibration: 0.89, temperature: 58, status: 'warning' as const },
  { id: 'M-004', name: 'Assembly Robot Arm', health: 91, nextMaintenance: '18 days', vibration: 0.35, temperature: 38, status: 'healthy' as const },
  { id: 'M-005', name: 'Industrial Conveyor', health: 88, nextMaintenance: '8 days', vibration: 0.51, temperature: 42, status: 'healthy' as const },
  { id: 'M-006', name: 'Welding Station', health: 45, nextMaintenance: 'Overdue', vibration: 1.24, temperature: 68, status: 'critical' as const },
];

// Historical failure prediction
const failurePrediction = [
  { date: 'Jan', predicted: 3, actual: 2, prevented: 1 },
  { date: 'Feb', predicted: 5, actual: 4, prevented: 3 },
  { date: 'Mar', predicted: 4, actual: 3, prevented: 2 },
  { date: 'Apr', predicted: 6, actual: 5, prevented: 4 },
  { date: 'May', predicted: 2, actual: 1, prevented: 2 },
  { date: 'Jun', predicted: 4, actual: 2, prevented: 3 },
];

// Vibration trend for selected machine
const vibrationTrend = [
  { time: '00:00', value: 0.35, threshold: 0.8 },
  { time: '04:00', value: 0.42, threshold: 0.8 },
  { time: '08:00', value: 0.58, threshold: 0.8 },
  { time: '12:00', value: 0.72, threshold: 0.8 },
  { time: '16:00', value: 0.89, threshold: 0.8 },
  { time: '20:00', value: 0.95, threshold: 0.8 },
];

// Maintenance schedule
const maintenanceSchedule = [
  { machine: 'Welding Station', type: 'Emergency Repair', date: 'Today', priority: 'critical' as const, cost: '€4,200' },
  { machine: 'Laser Cutting System', type: 'Preventive', date: 'Tomorrow', priority: 'high' as const, cost: '€850' },
  { machine: 'Hydraulic Press', type: 'Scheduled', date: 'Feb 4', priority: 'medium' as const, cost: '€1,200' },
  { machine: 'Industrial Conveyor', type: 'Inspection', date: 'Feb 8', priority: 'low' as const, cost: '€350' },
];

// Cost savings data
const costSavingsData = [
  { category: 'Unplanned Downtime', before: 45000, after: 12000 },
  { category: 'Emergency Repairs', before: 28000, after: 8500 },
  { category: 'Parts Inventory', before: 15000, after: 9000 },
  { category: 'Labor Costs', before: 22000, after: 14000 },
];

// Scatter data for anomaly detection
const anomalyData = [
  { x: 0.3, y: 42, z: 100, name: 'M-001', normal: true },
  { x: 0.68, y: 52, z: 100, name: 'M-002', normal: true },
  { x: 0.89, y: 58, z: 100, name: 'M-003', normal: false },
  { x: 0.35, y: 38, z: 100, name: 'M-004', normal: true },
  { x: 0.51, y: 42, z: 100, name: 'M-005', normal: true },
  { x: 1.24, y: 68, z: 100, name: 'M-006', normal: false },
];

// MTBF (Mean Time Between Failures) data
const mtbfData = [
  { month: 'Aug', mtbf: 245, target: 280 },
  { month: 'Sep', mtbf: 268, target: 280 },
  { month: 'Oct', mtbf: 312, target: 280 },
  { month: 'Nov', mtbf: 298, target: 280 },
  { month: 'Dec', mtbf: 334, target: 280 },
  { month: 'Jan', mtbf: 356, target: 280 },
];

export function PredictiveMaintenanceTab() {
  const [selectedMachine, setSelectedMachine] = useState<string | null>('M-003');

  const totalSaved = costSavingsData.reduce((acc, item) => acc + (item.before - item.after), 0);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">AI Predictive Maintenance</h2>
          <p className="text-muted-foreground">Machine learning-based failure prediction and maintenance optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="warning" label="2 Alerts Active" />
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Equipment Health Score"
          value="82.4%"
          subtitle="Fleet average"
          icon={Settings}
          iconColor="text-primary"
          delay={0}
        />
        <MetricCard
          title="Failures Prevented"
          value="15"
          change={23}
          changeLabel="this quarter"
          icon={CheckCircle}
          iconColor="text-green-500"
          delay={0.1}
        />
        <MetricCard
          title="Downtime Avoided"
          value="127 hrs"
          subtitle="Est. value: €38,100"
          icon={Clock}
          iconColor="text-accent"
          delay={0.2}
        />
        <MetricCard
          title="Total Cost Savings"
          value={`€${(totalSaved / 1000).toFixed(0)}K`}
          change={-62}
          changeLabel="vs reactive maintenance"
          icon={TrendingDown}
          iconColor="text-amber-500"
          delay={0.3}
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Machine Health Panel */}
        <ChartCard
          title="Machine Health Monitor"
          subtitle="Real-time equipment status"
          className="lg:col-span-2"
          delay={0.4}
          insight="M-006 (Welding Station) shows critical degradation pattern. Immediate bearing replacement recommended to prevent catastrophic failure within 48 hours."
        >
          <div className="space-y-4">
            {machineHealthData.map((machine, i) => (
              <motion.div
                key={machine.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMachine === machine.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedMachine(machine.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${
                      machine.status === 'healthy' ? 'bg-green-500' :
                      machine.status === 'attention' ? 'bg-amber-500' :
                      machine.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">{machine.name}</p>
                      <p className="text-xs text-muted-foreground">{machine.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={
                        machine.status === 'healthy' ? 'success' :
                        machine.status === 'attention' ? 'warning' :
                        machine.status === 'warning' ? 'warning' : 'danger'
                      }
                      label={machine.status}
                      pulse={machine.status === 'critical'}
                    />
                    <div className="text-right">
                      <p className="text-lg font-bold">{machine.health}%</p>
                      <p className="text-xs text-muted-foreground">Health</p>
                    </div>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      machine.health > 80 ? 'bg-green-500' :
                      machine.health > 60 ? 'bg-amber-500' :
                      machine.health > 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${machine.health}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Vibration</span>
                    <p className={`font-medium ${machine.vibration > 0.8 ? 'text-red-500' : ''}`}>
                      {machine.vibration} mm/s
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Temperature</span>
                    <p className={`font-medium ${machine.temperature > 55 ? 'text-amber-500' : ''}`}>
                      {machine.temperature}°C
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next Service</span>
                    <p className={`font-medium ${machine.nextMaintenance === 'Overdue' ? 'text-red-500' : ''}`}>
                      {machine.nextMaintenance}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>

        {/* Right Panel - Vibration Analysis */}
        <div className="space-y-6">
          <ChartCard
            title="Vibration Trend Analysis"
            subtitle="M-003 Laser Cutting System"
            delay={0.5}
          >
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={vibrationTrend}>
                <defs>
                  <linearGradient id="colorVibration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 75%, 55%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(0, 75%, 55%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215, 15%, 50%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(215, 15%, 50%)" domain={[0, 1.2]} />
                <Tooltip />
                <ReferenceLine y={0.8} stroke="hsl(0, 75%, 55%)" strokeDasharray="5 5" label={{ value: 'Threshold', fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(0, 75%, 55%)"
                  strokeWidth={2}
                  fill="url(#colorVibration)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-xs text-red-700 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>Vibration exceeds threshold. Bearing degradation detected. Predicted failure: 24-48 hours.</span>
              </p>
            </div>
          </ChartCard>

          <ChartCard
            title="Anomaly Detection"
            subtitle="Vibration vs Temperature"
            delay={0.6}
          >
            <ResponsiveContainer width="100%" height={180}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                <XAxis dataKey="x" name="Vibration" tick={{ fontSize: 10 }} stroke="hsl(215, 15%, 50%)" label={{ value: 'Vibration (mm/s)', position: 'bottom', fontSize: 10 }} />
                <YAxis dataKey="y" name="Temperature" tick={{ fontSize: 10 }} stroke="hsl(215, 15%, 50%)" label={{ value: '°C', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                <Tooltip />
                <Scatter data={anomalyData} fill="hsl(215, 80%, 50%)">
                  {anomalyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.normal ? 'hsl(215, 80%, 50%)' : 'hsl(0, 75%, 55%)'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">Red points indicate anomalous behavior requiring attention</p>
          </ChartCard>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Failure Prediction Accuracy */}
        <ChartCard
          title="AI Prediction Accuracy"
          subtitle="Predicted vs Actual failures over 6 months"
          delay={0.7}
          insight="AI prediction accuracy: 94.2%. The model successfully prevented 15 unplanned outages worth an estimated €127,000 in avoided losses."
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={failurePrediction}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <Tooltip />
              <Bar dataKey="predicted" name="AI Predicted" fill="hsl(215, 80%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prevented" name="Failures Prevented" fill="hsl(150, 70%, 40%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cost Savings Breakdown */}
        <ChartCard
          title="Annual Cost Comparison"
          subtitle="Reactive vs Predictive maintenance"
          delay={0.8}
          insight="Total annual savings: €66,500 (62% reduction). ROI on predictive maintenance system achieved within 4 months."
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={costSavingsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(215, 15%, 50%)" tickFormatter={(value) => `€${value/1000}K`} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 10 }} stroke="hsl(215, 15%, 50%)" width={100} />
              <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
              <Bar dataKey="before" name="Before (Reactive)" fill="hsl(0, 75%, 55%)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="after" name="After (Predictive)" fill="hsl(150, 70%, 40%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* MTBF Chart */}
      <ChartCard
        title="Mittlere Zeit zwischen Ausfällen (MTBF)"
        subtitle="6-Monats-Trend in Stunden"
        delay={0.85}
        insight="MTBF hat sich von 245 auf 356 Stunden verbessert (+45%). Das zeigt eine signifikante Verbesserung der Anlagenzuverlässigkeit durch vorausschauende Wartung."
      >
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={mtbfData}>
            <defs>
              <linearGradient id="colorMtbf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(175, 70%, 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(175, 70%, 50%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" label={{ value: 'Stunden', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }} 
            />
            <ReferenceLine y={280} stroke="hsl(var(--primary))" strokeDasharray="5 5" label={{ value: 'Ziel', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
            <Area type="monotone" dataKey="mtbf" name="MTBF (Stunden)" stroke="hsl(175, 70%, 50%)" strokeWidth={2} fill="url(#colorMtbf)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Maintenance Schedule */}
      <ChartCard
        title="Upcoming Maintenance Schedule"
        subtitle="AI-optimized work orders"
        delay={0.9}
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Machine</th>
                <th>Type</th>
                <th>Scheduled</th>
                <th>Priority</th>
                <th>Est. Cost</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceSchedule.map((item, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                >
                  <td className="font-medium">{item.machine}</td>
                  <td>{item.type}</td>
                  <td className={item.date === 'Today' ? 'text-red-500 font-medium' : ''}>{item.date}</td>
                  <td>
                    <StatusBadge
                      status={
                        item.priority === 'critical' ? 'danger' :
                        item.priority === 'high' ? 'warning' :
                        item.priority === 'medium' ? 'info' : 'neutral'
                      }
                      label={item.priority}
                    />
                  </td>
                  <td>{item.cost}</td>
                  <td>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Wrench className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
