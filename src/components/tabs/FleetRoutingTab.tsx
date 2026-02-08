import { useState } from 'react';
import { motion } from 'framer-motion';
import { MetricCard } from '../shared/MetricCard';
import { ChartCard } from '../shared/ChartCard';
import { StatusBadge } from '../shared/StatusBadge';
import { Truck, MapPin, Clock, Fuel, Route, Play, Pause, TrendingDown, BarChart3, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FleetRoutingLeafletMap } from '@/components/maps/FleetRoutingLeafletMap';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Heilbronn area coordinates
const HEILBRONN_CENTER: [number, number] = [49.1427, 9.2109];

// Delivery locations around Heilbronn - 10 locations
const deliveryLocations = [
  { id: 1, name: 'Warehouse HQ', lat: 49.1427, lng: 9.2109, type: 'warehouse' as const },
  { id: 2, name: 'Audi Neckarsulm', lat: 49.1912, lng: 9.2272, type: 'customer' as const, demand: 45 },
  { id: 3, name: 'Bosch Abstatt', lat: 49.0743, lng: 9.3056, type: 'customer' as const, demand: 32 },
  { id: 4, name: 'Lidl Zentrale', lat: 49.0817, lng: 9.2694, type: 'customer' as const, demand: 78 },
  { id: 5, name: 'Schwarz IT', lat: 49.1167, lng: 9.2167, type: 'customer' as const, demand: 24 },
  { id: 6, name: 'Würth Künzelsau', lat: 49.2833, lng: 9.6833, type: 'customer' as const, demand: 56 },
  { id: 7, name: 'Ziehl-Abegg', lat: 49.1500, lng: 9.4667, type: 'customer' as const, demand: 38 },
  { id: 8, name: 'Bechtle Neckarsulm', lat: 49.1939, lng: 9.2250, type: 'customer' as const, demand: 29 },
  { id: 9, name: 'Kolbenschmidt', lat: 49.1350, lng: 9.1780, type: 'customer' as const, demand: 41 },
  { id: 10, name: 'KACO Bad Rappenau', lat: 49.2350, lng: 9.1019, type: 'customer' as const, demand: 35 },
  { id: 11, name: 'Intersport Heilbronn', lat: 49.1500, lng: 9.2300, type: 'customer' as const, demand: 22 },
];

// Optimized routes - 4 routes covering all locations
const routes = [
  {
    id: 'Route A',
    vehicle: 'Truck 01',
    color: '#3b82f6',
    stops: [1, 2, 8, 5, 11, 1],
    distance: 32.4,
    time: '2h 05m',
    status: 'active' as const,
    load: 120,
  },
  {
    id: 'Route B',
    vehicle: 'Truck 02',
    color: '#22c55e',
    stops: [1, 4, 3, 9, 1],
    distance: 26.8,
    time: '1h 40m',
    status: 'active' as const,
    load: 134,
  },
  {
    id: 'Route C',
    vehicle: 'Truck 03',
    color: '#f97316',
    stops: [1, 10, 6, 7, 1],
    distance: 72.5,
    time: '2h 45m',
    status: 'active' as const,
    load: 130,
  },
  {
    id: 'Route D',
    vehicle: 'Truck 04',
    color: '#8b5cf6',
    stops: [1, 9, 10, 1],
    distance: 38.2,
    time: '1h 30m',
    status: 'pending' as const,
    load: 76,
  },
];

// Fleet data
const fleetData = [
  { vehicle: 'Truck 01', driver: 'M. Schmidt', status: 'en-route', eta: '14:35', fuel: 72, speed: 65 },
  { vehicle: 'Truck 02', driver: 'K. Weber', status: 'delivering', eta: '13:50', fuel: 85, speed: 0 },
  { vehicle: 'Truck 03', driver: 'A. Meyer', status: 'waiting', eta: '15:00', fuel: 94, speed: 0 },
  { vehicle: 'Truck 04', driver: 'L. Fischer', status: 'maintenance', eta: '-', fuel: 45, speed: 0 },
];

// Optimization comparison
const optimizationData = [
  { metric: 'Before AI', distance: 142, time: 8.5, fuel: 78 },
  { metric: 'After AI', distance: 118, time: 5.5, fuel: 52 },
];

// Hourly deliveries
const dailyDeliveries = [
  { hour: '08:00', deliveries: 2, onTime: 2 },
  { hour: '10:00', deliveries: 5, onTime: 5 },
  { hour: '12:00', deliveries: 8, onTime: 7 },
  { hour: '14:00', deliveries: 12, onTime: 11 },
  { hour: '16:00', deliveries: 10, onTime: 10 },
  { hour: '18:00', deliveries: 6, onTime: 6 },
];

// Weekly performance trend
const weeklyPerformance = [
  { day: 'Mon', efficiency: 92, deliveries: 48, delays: 3 },
  { day: 'Tue', efficiency: 95, deliveries: 52, delays: 2 },
  { day: 'Wed', efficiency: 88, deliveries: 45, delays: 5 },
  { day: 'Thu', efficiency: 97, deliveries: 55, delays: 1 },
  { day: 'Fri', efficiency: 94, deliveries: 50, delays: 2 },
  { day: 'Sat', efficiency: 91, deliveries: 32, delays: 3 },
];

// Driver performance radar
const driverPerformance = [
  { subject: 'On-Time', A: 98, B: 92, fullMark: 100 },
  { subject: 'Fuel Eff.', A: 85, B: 78, fullMark: 100 },
  { subject: 'Safety', A: 95, B: 88, fullMark: 100 },
  { subject: 'Speed', A: 82, B: 90, fullMark: 100 },
  { subject: 'Customer', A: 92, B: 85, fullMark: 100 },
];

// Cost breakdown
const costBreakdown = [
  { name: 'Fuel', value: 42, color: '#f59e0b' },
  { name: 'Labor', value: 28, color: '#3b82f6' },
  { name: 'Maintenance', value: 18, color: '#22c55e' },
  { name: 'Tolls', value: 12, color: '#8b5cf6' },
];

// CO2 savings data
const co2Data = [
  { month: 'Aug', emissions: 4.2, saved: 0.8 },
  { month: 'Sep', emissions: 3.9, saved: 1.1 },
  { month: 'Oct', emissions: 3.6, saved: 1.4 },
  { month: 'Nov', emissions: 3.4, saved: 1.6 },
  { month: 'Dec', emissions: 3.8, saved: 1.2 },
  { month: 'Jan', emissions: 3.2, saved: 1.8 },
];

export function FleetRoutingTab() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const totalSavings = {
    distance: ((142 - 118) / 142 * 100).toFixed(0),
    time: ((8.5 - 5.5) / 8.5 * 100).toFixed(0),
    fuel: ((78 - 52) / 78 * 100).toFixed(0),
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">AI Fleet Route Optimization</h2>
          <p className="text-muted-foreground">Real-time vehicle routing for Heilbronn-Franken region</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isAnimating ? "secondary" : "default"}
            size="sm"
            onClick={() => setIsAnimating(!isAnimating)}
            className="gap-2"
          >
            {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isAnimating ? 'Pause' : 'Simulate'}
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Vehicles"
          value="3 / 4"
          subtitle="1 in maintenance"
          icon={Truck}
          iconColor="text-primary"
          delay={0}
        />
        <MetricCard
          title="Distance Saved"
          value={`${totalSavings.distance}%`}
          change={17}
          changeLabel="vs manual routing"
          icon={Route}
          iconColor="text-green-500"
          delay={0.1}
        />
        <MetricCard
          title="Deliveries Today"
          value="43 / 48"
          subtitle="5 remaining"
          icon={MapPin}
          iconColor="text-accent"
          delay={0.2}
        />
        <MetricCard
          title="Fuel Savings"
          value="€847"
          change={-33}
          changeLabel="cost reduction"
          icon={Fuel}
          iconColor="text-amber-500"
          delay={0.3}
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <ChartCard
          title="Live Route Map"
          subtitle="CartoDB Dark • OSRM Street Routing"
          className="lg:col-span-2"
          delay={0.4}
          insight="AI-optimized routing with real street navigation reduces total distance by 17% and eliminates 3 redundant stops through intelligent clustering."
        >
          <div className="h-[420px] rounded-lg overflow-hidden map-container">
            <FleetRoutingLeafletMap
              center={HEILBRONN_CENTER}
              zoom={11}
              className="h-full w-full"
              locations={deliveryLocations}
              routes={routes}
              selectedRoute={selectedRoute}
              onToggleRoute={(routeId) => setSelectedRoute(routeId === selectedRoute ? null : routeId)}
              isAnimating={isAnimating}
            />
          </div>
        </ChartCard>

        {/* Route Details */}
        <ChartCard
          title="Active Routes"
          subtitle="Click to highlight on map"
          delay={0.5}
        >
          <div className="space-y-3">
            {routes.map((route, i) => (
              <motion.div
                key={route.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedRoute === route.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedRoute(route.id === selectedRoute ? null : route.id)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: route.color }}
                  />
                  <span className="font-medium text-sm">{route.id}</span>
                  <StatusBadge
                    status={route.status === 'active' ? 'success' : 'warning'}
                    label={route.status}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-muted-foreground">
                    <Truck className="inline h-3 w-3 mr-1" />
                    {route.vehicle}
                  </div>
                  <div className="text-muted-foreground">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {route.time}
                  </div>
                  <div className="text-muted-foreground">
                    <Route className="inline h-3 w-3 mr-1" />
                    {route.distance} km
                  </div>
                  <div className="text-muted-foreground">
                    📦 {route.load} units
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground truncate">
                  Stops: {route.stops.map(id => deliveryLocations.find(l => l.id === id)?.name.split(' ')[0]).join(' → ')}
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Performance Trend */}
        <ChartCard
          title="Weekly Performance Trend"
          subtitle="Efficiency and delivery metrics"
          className="lg:col-span-2"
          delay={0.6}
          insight="Thursday achieved 97% efficiency with only 1 delay. Analyzing Thursday's conditions could help optimize other days."
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyPerformance}>
              <defs>
                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }} 
              />
              <Area type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#3b82f6" strokeWidth={2} fill="url(#colorEfficiency)" />
              <Line type="monotone" dataKey="deliveries" name="Deliveries" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cost Breakdown */}
        <ChartCard
          title="Operating Cost Breakdown"
          subtitle="Monthly distribution"
          delay={0.7}
        >
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
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
            {costBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Second Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Optimization Impact */}
        <ChartCard
          title="AI Optimization Impact"
          subtitle="Before vs After comparison"
          delay={0.8}
          insight="Implementing AI routing reduced daily operational costs by €847 through optimized fuel consumption and reduced vehicle wear."
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={optimizationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis dataKey="metric" type="category" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar dataKey="distance" name="Distance (km)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="fuel" name="Fuel (L)" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* CO2 Emissions Reduction */}
        <ChartCard
          title="CO₂ Emissions Tracking"
          subtitle="Monthly emissions and savings"
          delay={0.9}
          insight="Route optimization has reduced carbon footprint by 32% over 6 months, equivalent to planting 180 trees."
        >
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={co2Data}>
              <defs>
                <linearGradient id="colorEmissions2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" label={{ value: 'Tonnes', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Area type="monotone" dataKey="emissions" name="Emissions" stroke="#ef4444" strokeWidth={2} fill="url(#colorEmissions2)" />
              <Area type="monotone" dataKey="saved" name="Saved" stroke="#22c55e" strokeWidth={2} fill="url(#colorSaved)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Fleet Status Table */}
      <ChartCard
        title="Fleet Status Overview"
        subtitle="All vehicles in real-time"
        delay={1.0}
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Status</th>
                <th>ETA</th>
                <th>Speed</th>
                <th>Fuel Level</th>
              </tr>
            </thead>
            <tbody>
              {fleetData.map((vehicle, i) => (
                <motion.tr
                  key={vehicle.vehicle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 + i * 0.1 }}
                >
                  <td className="font-medium">{vehicle.vehicle}</td>
                  <td>{vehicle.driver}</td>
                  <td>
                    <StatusBadge
                      status={
                        vehicle.status === 'delivering' ? 'success' :
                        vehicle.status === 'en-route' ? 'info' :
                        vehicle.status === 'waiting' ? 'warning' : 'danger'
                      }
                      label={vehicle.status}
                    />
                  </td>
                  <td>{vehicle.eta}</td>
                  <td>{vehicle.speed > 0 ? `${vehicle.speed} km/h` : '-'}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            vehicle.fuel > 70 ? 'bg-green-500' :
                            vehicle.fuel > 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${vehicle.fuel}%` }}
                        />
                      </div>
                      <span className="text-xs">{vehicle.fuel}%</span>
                    </div>
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
